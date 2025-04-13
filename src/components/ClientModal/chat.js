import { useState, useEffect } from 'react';
import { FiAlertCircle, FiClock, FiInfo, FiTag, FiX } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import ChatBase from './ChatBase';
import styles from './ChatStyles.module.css';

export default function ChatCliente({ chamado, currentUser, onClose }) {
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  
  useEffect(() => {
    if (chamado.id && chamado.historico) {
      setTicketHistory(chamado.historico || []);
    }
  }, [chamado]);
  
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
          
          <div className={styles.ticketStatusInfo}>
            <strong>Status Atual:</strong>
            <span className={`${styles.statusBadge} ${styles[`status-${chamado.status?.toLowerCase().replace(' ', '-') || 'aberto'}`]}`}>
              {chamado.status || 'Aberto'}
            </span>
          </div>
          
          {chamado.solucao && (
            <div className={styles.solutionInfo}>
              <h4>Solução Aplicada</h4>
              <p className={styles.solutionText}>{chamado.solucao}</p>
            </div>
          )}
          
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
          
          {chamado.status === 'Resolvido' && !chamado.avaliacaoCliente && (
            <div className={styles.feedbackSection}>
              <h4>Avalie o Atendimento</h4>
              <p>Este chamado foi resolvido. Por favor, avalie a solução fornecida.</p>
              <div className={styles.ratingButtons}>
                <button 
                  onClick={() => avaliarAtendimento(5)}
                  className={styles.ratingButton}
                >
                  Excelente
                </button>
                <button 
                  onClick={() => avaliarAtendimento(4)}
                  className={styles.ratingButton}
                >
                  Bom
                </button>
                <button 
                  onClick={() => avaliarAtendimento(3)}
                  className={styles.ratingButton}
                >
                  Regular
                </button>
                <button 
                  onClick={() => avaliarAtendimento(2)}
                  className={styles.ratingButton}
                >
                  Ruim
                </button>
                <button 
                  onClick={() => avaliarAtendimento(1)}
                  className={styles.ratingButton}
                >
                  Péssimo
                </button>
              </div>
            </div>
          )}
          
          {chamado.avaliacaoCliente && (
            <div className={styles.feedbackInfo}>
              <h4>Sua Avaliação</h4>
              <div className={styles.ratingDisplay}>
                <strong>Nota:</strong> {chamado.avaliacaoCliente}/5
              </div>
              {chamado.comentarioCliente && (
                <div className={styles.feedbackComment}>
                  <strong>Comentário:</strong>
                  <p>{chamado.comentarioCliente}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  async function avaliarAtendimento(nota) {
    if (!chamado.id) return;
    
    try {
      const chamadoRef = doc(db, "chamados", chamado.id);
      const docSnap = await getDoc(chamadoRef);
      
      if (docSnap.exists()) {
        // Implementar lógica para salvar a avaliação
        // Esta função seria implementada em um componente separado
        // para capturar a nota e possíveis comentários
        
        alert(`Obrigado por avaliar o atendimento com nota ${nota}!`);
        
        // Recarregar os dados do chamado após avaliação
        // Esta função seria implementada no componente pai
      }
    } catch (error) {
      console.error("Erro ao registrar avaliação:", error);
      alert("Erro ao registrar sua avaliação");
    }
  }
  
  function handleReopenTicket() {
    if (!chamado.id || chamado.status !== 'Resolvido') return;
    
    // Aqui você implementaria a lógica para reabrir o chamado
    // Isso poderia envolver um modal de confirmação e uma atualização no Firestore
    alert("Função para reabrir o chamado seria implementada aqui");
  }
  
  return (
    <div className={styles.chatClienteContainer}>
      {showChatInfo ? (
        <div className={styles.infoContainer}>
          {renderTicketInfo()}
          <button 
            onClick={() => setShowChatInfo(false)}
            className={styles.closeInfoButton}
          >
            Voltar ao Chat
          </button>
        </div>
      ) : (
        <>
          <div className={styles.chatClienteHeader}>
            <div className={styles.ticketStatus}>
              <span className={`${styles.statusIndicator} ${styles[`status-${chamado.status?.toLowerCase().replace(' ', '-') || 'aberto'}`]}`}>
                {chamado.status || 'Aberto'}
              </span>
            </div>
            
            <div className={styles.ticketActions}>
              <button 
                onClick={() => setShowChatInfo(true)}
                className={styles.infoButton}
                title="Ver informações do chamado"
              >
                <FiInfo size={20} />
                <span>Detalhes</span>
              </button>
              
              {chamado.status === 'Resolvido' && (
                <button 
                  onClick={handleReopenTicket}
                  className={styles.reopenButton}
                >
                  Reabrir Chamado
                </button>
              )}
              
              <button 
                onClick={onClose}
                className={styles.closeButton}
                title="Fechar chat"
              >
                <FiX size={20} />
                <span className={styles.closeLabel}>Fechar</span>
              </button>
            </div>
          </div>
          
          <ChatBase 
            chamado={chamado} 
            currentUser={currentUser} 
            onClose={onClose} 
            userType="cliente"
          />
          
          {chamado.status === 'Resolvido' && !chamado.avaliacaoCliente && (
            <div className={styles.feedbackPrompt}>
              <p>Este chamado foi resolvido. Por favor, avalie a solução clicando em "Detalhes".</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}