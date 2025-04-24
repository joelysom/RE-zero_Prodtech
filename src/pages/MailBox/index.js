import { useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import styles from "./SupportInbox.module.css";
import ClientSidebar from "../../components/ClientHeader";

export default function SupportInbox() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadRequests();
    }
  }, [user]);

  async function loadRequests() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "suporte"),
        where("userId", "==", user.uid),
        orderBy("created", "desc")
      );
      
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
      console.log("Solicitações carregadas:", list);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      toast.error("Erro ao carregar suas solicitações de suporte.");
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
      console.log("Respostas carregadas:", responsesList);
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
      toast.error("Erro ao carregar as respostas.");
    } finally {
      setLoadingResponses(false);
    }
  }

  function handleOpenModal(item) {
    setSelectedRequest(item);
    setResponses([]);
    setModalVisible(true);
    loadResponses(item.id);
  }

  function handleCloseModal() {
    setSelectedRequest(null);
    setModalVisible(false);
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
    <div className="dashboard-container">
      <ClientSidebar />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.contentHeader}>
            <h1>Minhas Solicitações de Suporte</h1>
            <button 
              className={styles.newRequestButton}
              onClick={() => window.location.href = '/support'}
            >
              Nova Solicitação
            </button>
          </header>

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Carregando solicitações...</p>
            </div>
          ) : (
            <>
              {requests.length === 0 ? (
                <div className={styles.emptyContainer}>
                  <p>Você ainda não tem solicitações de suporte.</p>
                  <button 
                    className={styles.createFirstButton}
                    onClick={() => window.location.href = '/support'}
                  >
                    Criar primeira solicitação
                  </button>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Assunto</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((item) => (
                        <tr key={item.id} className={item.status === "Respondido" ? styles.hasNewResponse : ""}>
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
                              {item.status === "Respondido" ? "Ver Resposta" : "Detalhes"}
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

        {/* Modal para visualizar solicitação e respostas */}
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
                    <p><strong>Data:</strong> {selectedRequest.createdFormatted}</p>
                    <p>
                      <strong>Status:</strong>
                      <span className={`${styles.statusBadge} ${getStatusClass(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                  </div>
                  
                  <div className={styles.problemDescription}>
                    <h3>Sua Solicitação:</h3>
                    <p>{selectedRequest.problema}</p>
                  </div>
                </div>
                
                <div className={styles.responsesSection}>
                  <h3>Respostas do Suporte</h3>
                  
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
                          {responses.map((response) => (
                            <div key={response.id} className={styles.responseItem}>
                              <div className={styles.responseHeader}>
                                <div className={styles.techInfo}>
                                  <p><strong>{response.tecnicoNome}</strong></p>
                                  <p className={styles.techEmail}>{response.tecnicoEmail}</p>
                                </div>
                                <span className={styles.responseDate}>{response.dataFormatted}</span>
                              </div>
                              <div className={styles.responseContent}>
                                <p>{response.conteudo}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <footer className={styles.modalFooter}>
                <button
                  className={styles.closeModalButton}
                  onClick={handleCloseModal}
                >
                  Fechar
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}