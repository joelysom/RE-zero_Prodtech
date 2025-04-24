import { useState, useEffect, useContext } from "react";
import { collection, query, getDocs, doc, updateDoc, addDoc, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import styles from "./SupportRequests.module.css";
import Sidebar from "../../components/HeaderTecnico"; // Import the Sidebar component instead of TechnicianHeader

export default function SupportRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("all");

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

  function handleOpenModal(item) {
    setSelectedRequest(item);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setSelectedRequest(null);
    setModalVisible(false);
    setResponse("");
  }

  async function handleSendResponse() {
    if (!response.trim()) {
      toast.warning("Digite uma resposta antes de enviar.");
      return;
    }

    try {
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
      handleCloseModal();
      loadRequests();
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta. Tente novamente.");
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
                        <td>{item.nome}</td>
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
                        <td>{item.createdFormatted}</td>
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
              
              <div className={styles.responseSection}>
                <h3>Responder ao Cliente</h3>
                <textarea
                  placeholder="Digite sua resposta aqui..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className={styles.responseTextarea}
                ></textarea>
                
                <div className={styles.responseActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.sendButton}
                    onClick={handleSendResponse}
                  >
                    Enviar Resposta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}