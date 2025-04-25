import { useState, useEffect, useContext } from "react";
import { collection, query, getDocs, doc, updateDoc, addDoc, orderBy, where, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import styles from "./SupportRequests.module.css";
import Sidebar from "../../components/HeaderTecnico";

export default function SupportRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentResponseId, setCurrentResponseId] = useState(null);
  const [deleteResponseModalVisible, setDeleteResponseModalVisible] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [deletingResponse, setDeletingResponse] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [filteredStatus]);

  async function loadRequests() {
    setLoading(true);
    try {
      let q;
      
      if (filteredStatus === "all") {
        q = query(collection(db, "suporte"), orderBy("created", "desc"));
      } else {
        q = query(
          collection(db, "suporte"), 
          where("status", "==", filteredStatus),
          orderBy("created", "desc")
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data(),
          createdFormatted: new Date(doc.data().created.toDate()).toLocaleDateString('pt-BR')
        });
      });
      
      setRequests(list);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      toast.error("Erro ao carregar solicitações de suporte.");
    } finally {
      setLoading(false);
    }
  }

  async function loadResponses(requestId) {
    setLoadingResponses(true);
    try {
      const responsesRef = collection(db, "suporte", requestId, "respostas");
      const q = query(responsesRef, orderBy("data", "desc"));
      const querySnapshot = await getDocs(q);
      
      const responsesList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        responsesList.push({
          id: doc.id,
          ...data,
          dataFormatted: new Date(data.data.toDate()).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      });
      
      setResponses(responsesList);
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
      toast.error("Erro ao carregar as respostas.");
    } finally {
      setLoadingResponses(false);
    }
  }

  function handleOpenModal(item) {
    setSelectedRequest(item);
    setModalVisible(true);
    setResponse("");
    setEditMode(false);
    setCurrentResponseId(null);
    loadResponses(item.id);
  }

  function handleCloseModal() {
    setSelectedRequest(null);
    setModalVisible(false);
    setResponse("");
    setEditMode(false);
    setCurrentResponseId(null);
  }

  async function handleSendResponse() {
    if (!response.trim()) {
      toast.warning("Digite uma resposta antes de enviar.");
      return;
    }

    try {
      if (editMode && currentResponseId) {
        // Atualizar resposta existente
        const responseRef = doc(db, "suporte", selectedRequest.id, "respostas", currentResponseId);
        await updateDoc(responseRef, {
          conteudo: response,
          editado: true,
          dataEdicao: new Date()
        });

        toast.success("Resposta atualizada com sucesso!");
      } else {
        // Adicionar nova resposta
        // Atualizar o status da solicitação para "Respondido"
        const requestRef = doc(db, "suporte", selectedRequest.id);
        await updateDoc(requestRef, {
          status: "Respondido"
        });

        // Adicionar a resposta ao subcollection "respostas"
        await addDoc(collection(db, "suporte", selectedRequest.id, "respostas"), {
          conteudo: response,
          data: new Date(),
          tecnicoId: user.uid,
          tecnicoNome: user.nome,
          tecnicoEmail: user.email
        });

        toast.success("Resposta enviada com sucesso!");
      }
      
      // Recarregar as respostas e limpar o formulário
      loadResponses(selectedRequest.id);
      setResponse("");
      setEditMode(false);
      setCurrentResponseId(null);
      
      // Atualizar a lista de solicitações para refletir o novo status
      loadRequests();
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta. Tente novamente.");
    }
  }

  function handleEditResponse(responseItem) {
    // Verificar se o técnico atual é o autor da resposta
    if (responseItem.tecnicoId !== user.uid) {
      toast.warning("Você só pode editar suas próprias respostas.");
      return;
    }

    setResponse(responseItem.conteudo);
    setEditMode(true);
    setCurrentResponseId(responseItem.id);
  }

  function handleCancelEdit() {
    setResponse("");
    setEditMode(false);
    setCurrentResponseId(null);
  }

  function handleOpenDeleteResponseModal(responseItem) {
    // Verificar se o técnico atual é o autor da resposta
    if (responseItem.tecnicoId !== user.uid) {
      toast.warning("Você só pode excluir suas próprias respostas.");
      return;
    }

    setResponseToDelete(responseItem);
    setDeleteResponseModalVisible(true);
  }

  function handleCloseDeleteResponseModal() {
    setResponseToDelete(null);
    setDeleteResponseModalVisible(false);
  }

  async function handleDeleteResponse() {
    if (!responseToDelete || !selectedRequest) return;

    setDeletingResponse(true);
    try {
      // Excluir a resposta
      await deleteDoc(
        doc(db, "suporte", selectedRequest.id, "respostas", responseToDelete.id)
      );

      // Verificar se ainda existem respostas
      const responsesRef = collection(db, "suporte", selectedRequest.id, "respostas");
      const responsesSnapshot = await getDocs(responsesRef);
      
      // Se não houver mais respostas, atualizar o status para "Em aberto"
      if (responsesSnapshot.empty) {
        const requestRef = doc(db, "suporte", selectedRequest.id);
        await updateDoc(requestRef, {
          status: "Em aberto"
        });
      }

      toast.success("Resposta excluída com sucesso!");
      
      // Recarregar as respostas
      loadResponses(selectedRequest.id);
      
      // Fechar o modal de exclusão
      handleCloseDeleteResponseModal();
      
      // Atualizar a lista de solicitações para refletir o novo status
      loadRequests();
    } catch (error) {
      console.error("Erro ao excluir resposta:", error);
      toast.error("Erro ao excluir resposta. Tente novamente.");
    } finally {
      setDeletingResponse(false);
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "Em aberto":
        return styles.statusOpen;
      case "Respondido":
        return styles.statusAnswered;
      case "Fechado":
        return styles.statusClosed;
      default:
        return "";
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <header className={styles.contentHeader}>
            <h1>Solicitações de Suporte</h1>
            
            <div className={styles.filterContainer}>
              <label htmlFor="statusFilter">Filtrar por status:</label>
              <select 
                id="statusFilter" 
                value={filteredStatus} 
                onChange={(e) => setFilteredStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos</option>
                <option value="Em aberto">Em aberto</option>
                <option value="Respondido">Respondido</option>
                <option value="Fechado">Fechado</option>
              </select>
            </div>
          </header>

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Carregando solicitações...</p>
            </div>
          ) : (
            <>
              {requests.length === 0 ? (
                <div className={styles.emptyContainer}>
                  <p>Nenhuma solicitação de suporte encontrada.</p>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Assunto</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((item) => (
                        <tr key={item.id}>
                          <td className={styles.clientColumn}>{item.nome}</td>
                          <td className={styles.subjectColumn}>
                            {item.problema.length > 50
                              ? `${item.problema.substring(0, 50)}...`
                              : item.problema}
                          </td>
                          <td>
                            <span className={`${styles.status} ${getStatusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className={styles.dateColumn}>{item.createdFormatted}</td>
                          <td>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleOpenModal(item)}
                            >
                              Visualizar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal para visualizar e responder solicitação */}
      {modalVisible && selectedRequest && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h2>Detalhes da Solicitação</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </header>
            
            <div className={styles.modalContent}>
              <div className={styles.requestDetails}>
                <div className={styles.requestInfo}>
                  <p><strong>Cliente:</strong> {selectedRequest.nome}</p>
                  <p><strong>Email:</strong> {selectedRequest.email}</p>
                  {selectedRequest.contato && (
                    <p><strong>Contato:</strong> {selectedRequest.contato}</p>
                  )}
                  <p><strong>Data:</strong> {selectedRequest.createdFormatted}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`${styles.statusBadge} ${getStatusClass(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
                
                <div className={styles.problemDescription}>
                  <h3>Descrição do Problema:</h3>
                  <p>{selectedRequest.problema}</p>
                </div>
              </div>
              
              {/* Seção de visualização de respostas anteriores */}
              <div className={styles.responsesSection}>
                <h3>Histórico de Respostas</h3>
                
                {loadingResponses ? (
                  <div className={styles.loadingResponses}>
                    <p>Carregando respostas...</p>
                  </div>
                ) : (
                  <>
                    {responses.length === 0 ? (
                      <div className={styles.noResponses}>
                        <p>Ainda não há respostas para esta solicitação.</p>
                      </div>
                    ) : (
                      <div className={styles.responsesList}>
                        {responses.map((responseItem) => (
                          <div key={responseItem.id} className={`${styles.responseItem} ${responseItem.tecnicoId === user.uid ? styles.ownResponse : ""}`}>
                            <div className={styles.responseHeader}>
                              <div className={styles.techInfo}>
                                <p><strong>{responseItem.tecnicoNome}</strong></p>
                                <p className={styles.techEmail}>{responseItem.tecnicoEmail}</p>
                              </div>
                              <span className={styles.responseDate}>
                                {responseItem.dataFormatted}
                                {responseItem.editado && <span className={styles.editedBadge}>(editado)</span>}
                              </span>
                            </div>
                            <div className={styles.responseContent}>
                              <p>{responseItem.conteudo}</p>
                            </div>
                            {responseItem.tecnicoId === user.uid && (
                              <div className={styles.responseActions}>
                                <button
                                  className={styles.editResponseButton}
                                  onClick={() => handleEditResponse(responseItem)}
                                >
                                  Editar
                                </button>
                                <button
                                  className={styles.deleteResponseButton}
                                  onClick={() => handleOpenDeleteResponseModal(responseItem)}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className={styles.responseSection}>
                <h3>{editMode ? "Editar Resposta" : "Responder ao Cliente"}</h3>
                <textarea
                  placeholder="Digite sua resposta aqui..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className={styles.responseTextarea}
                ></textarea>
                
                <div className={styles.responseActions}>
                  {editMode && (
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancelEdit}
                    >
                      Cancelar Edição
                    </button>
                  )}
                  <button
                    className={styles.sendButton}
                    onClick={handleSendResponse}
                  >
                    {editMode ? "Salvar Alterações" : "Enviar Resposta"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para excluir resposta */}
      {deleteResponseModalVisible && responseToDelete && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.deleteModal}`}>
            <header className={styles.modalHeader}>
              <h2>Confirmar Exclusão</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseDeleteResponseModal}
                disabled={deletingResponse}
              >
                &times;
              </button>
            </header>
            
            <div className={styles.modalContent}>
              <div className={styles.deleteConfirmation}>
                <div className={styles.warningIcon}>⚠️</div>
                <p>Tem certeza que deseja excluir esta resposta?</p>
                <p className={styles.deleteWarning}>Esta ação é irreversível.</p>
              </div>
            </div>
            
            <footer className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCloseDeleteResponseModal}
                disabled={deletingResponse}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleDeleteResponse}
                disabled={deletingResponse}
              >
                {deletingResponse ? "Excluindo..." : "Confirmar Exclusão"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}