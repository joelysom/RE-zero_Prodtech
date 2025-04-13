import { useState, useEffect } from 'react';
import { FiAlertCircle, FiClock, FiInfo, FiTag } from 'react-icons/fi';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import ChatBase from './ChatBase';
import styles from './ChatStyles.module.css';

export default function ChatTecnico({ chamado, currentUser, onClose }) {
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isSolvingTicket, setIsSolvingTicket] = useState(false);
  const [solucaoText, setSolucaoText] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  
  useEffect(() => {
    if (chamado.id && chamado.historico) {
      setTicketHistory(chamado.historico || []);
    }
    
    // Carregar solução anterior se existir
    if (chamado.solucao) {
      setSolucaoText(chamado.solucao);
    }
  }, [chamado]);
  
  async function alterarStatusChamado(novoStatus) {
    if (!chamado.id) return;
    
    setLoadingAction(true);
    
    try {
      const chamadoRef = doc(db, "chamados", chamado.id);
      const docSnap = await getDoc(chamadoRef);
      
      if (docSnap.exists()) {
        const historico = docSnap.data().historico || [];
        
        // Adicionar novo evento ao histórico
        const novoEvento = {
          data: new Date(),
          status: novoStatus,
          responsavel: currentUser.nome || currentUser.email,
          responsavelId: currentUser.uid
        };
        
        await updateDoc(chamadoRef, {
          status: novoStatus,
          historico: [...historico, novoEvento]
        });
        
        setTicketHistory([...historico, novoEvento]);
        
        alert(`Status do chamado alterado para: ${novoStatus}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do chamado");
    } finally {
      setLoadingAction(false);
    }
  }
  
  async function registrarSolucao() {
    if (!chamado.id || !solucaoText.trim()) return;
    
    setLoadingAction(true);
    
    try {
      const chamadoRef = doc(db, "chamados", chamado.id);
      const docSnap = await getDoc(chamadoRef);
      
      if (docSnap.exists()) {
        const historico = docSnap.data().historico || [];
        
        // Adicionar novo evento ao histórico
        const novoEvento = {
          data: new Date(),
          status: 'Resolvido',
          responsavel: currentUser.nome || currentUser.email,
          responsavelId: currentUser.uid,
          solucao: solucaoText
        };
        
        await updateDoc(chamadoRef, {
          status: 'Resolvido',
          solucao: solucaoText,
          dataFechamento: new Date(),
          historico: [...historico, novoEvento]
        });
        
        setTicketHistory([...historico, novoEvento]);
        
        alert("Chamado resolvido com sucesso!");
        setIsSolvingTicket(false);
      }
    } catch (error) {
      console.error("Erro ao registrar solução:", error);
      alert("Erro ao registrar solução do chamado");
    } finally {
      setLoadingAction(false);
    }
  }
  
  function formatDate(date) {
    if (!date) return '';
    
    // Se já é um objeto Date
    const dateObj = date instanceof Date ? date : date.toDate();
    
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function renderTicketInfo() {
    return (
      <div className={styles.ticketInfoPanel}>
        <div className={styles.ticketInfoHeader}>
          <h3>Informações do Chamado</h3>
          <button 
            onClick={() => setShowChatInfo(false)}
            className={styles.closeInfoButton}
          >
            <FiAlertCircle />
          </button>
        </div>
        
        <div className={styles.ticketInfoContent}>
          <div className={styles.ticketInfoItem}>
            <FiTag className={styles.infoIcon} />
            <div>
              <strong>Assunto:</strong>
              <p>{chamado.assunto}</p>
            </div>
          </div>
          
          <div className={styles.ticketInfoItem}>
            <FiInfo className={styles.infoIcon} />
            <div>
              <strong>Descrição:</strong>
              <p>{chamado.complemento}</p>
            </div>
          </div>
          
          <div className={styles.ticketInfoItem}>
            <FiClock className={styles.infoIcon} />
            <div>
              <strong>Abertura:</strong>
              <p>{formatDate(chamado.dataCriacao)}</p>
            </div>
          </div>
          
          {chamado.dataFechamento && (
            <div className={styles.ticketInfoItem}>
              <FiClock className={styles.infoIcon} />
              <div>
                <strong>Fechamento:</strong>
                <p>{formatDate(chamado.dataFechamento)}</p>
              </div>
            </div>
          )}
          
          <div className={styles.ticketPriority}>
            <strong>Prioridade:</strong>
            <span className={`${styles.priorityBadge} ${styles[`priority-${chamado.prioridade?.toLowerCase() || 'media'}`]}`}>
              {chamado.prioridade || 'Média'}
            </span>
          </div>
          
          <div className={styles.ticketHistorySection}>
            <h4>Histórico do Chamado</h4>
            <div className={styles.ticketHistory}>
              {ticketHistory.length > 0 ? (
                <ul className={styles.historyList}>
                  {ticketHistory.map((evento, index) => (
                    <li key={index} className={styles.historyItem}>
                      <div className={styles.historyTime}>
                        {formatDate(evento.data)}
                      </div>
                      <div className={styles.historyContent}>
                        <strong>{evento.responsavel}</strong> alterou o status para{' '}
                        <span className={styles.historyStatus}>
                          {evento.status}
                        </span>
                        {evento.solucao && (
                          <div className={styles.historySolution}>
                            <strong>Solução:</strong> {evento.solucao}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noHistory}>Nenhum histórico disponível</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function renderSolutionForm() {
    return (
      <div className={styles.solutionFormWrapper}>
        <h4>Registrar Solução</h4>
        <textarea
          value={solucaoText}
          onChange={(e) => setSolucaoText(e.target.value)}
          placeholder="Descreva detalhadamente a solução aplicada..."
          className={styles.solutionTextarea}
        />
        <div className={styles.solutionFormButtons}>
          <button 
            onClick={() => setIsSolvingTicket(false)}
            className={styles.cancelButton}
            disabled={loadingAction}
          >
            Cancelar
          </button>
          <button 
            onClick={registrarSolucao}
            className={styles.confirmButton}
            disabled={loadingAction || !solucaoText.trim()}
          >
            {loadingAction ? 'Salvando...' : 'Salvar Solução'}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.chatTecnicoContainer}>
      {showChatInfo ? (
        renderTicketInfo()
      ) : isSolvingTicket ? (
        renderSolutionForm()
      ) : (
        <>
          <div className={styles.chatTecnicoHeader}>
            <div className={styles.ticketActions}>
              <button 
                onClick={() => setShowChatInfo(true)}
                className={styles.infoButton}
                title="Ver informações do chamado"
              >
                <FiInfo size={20} />
                <span>Detalhes</span>
              </button>
              
              {chamado.status !== 'Em Andamento' && (
                <button 
                  onClick={() => alterarStatusChamado('Em Andamento')}
                  className={`${styles.statusButton} ${styles.inProgressButton}`}
                  disabled={loadingAction}
                >
                  Iniciar Atendimento
                </button>
              )}
              
              {chamado.status !== 'Pendente' && chamado.status !== 'Resolvido' && (
                <button 
                  onClick={() => alterarStatusChamado('Pendente')}
                  className={`${styles.statusButton} ${styles.pendingButton}`}
                  disabled={loadingAction}
                >
                  Marcar como Pendente
                </button>
              )}
              
              {chamado.status !== 'Resolvido' && (
                <button 
                  onClick={() => setIsSolvingTicket(true)}
                  className={`${styles.statusButton} ${styles.resolveButton}`}
                  disabled={loadingAction}
                >
                  Resolver Chamado
                </button>
              )}
            </div>
          </div>
          
          <ChatBase 
            chamado={chamado} 
            currentUser={currentUser} 
            onClose={onClose} 
            userType="tecnico"
          />
        </>
      )}
    </div>
  );
}