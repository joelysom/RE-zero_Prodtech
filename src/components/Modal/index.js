import { FiX, FiUser, FiClock, FiPhone, FiMail, FiFolder, FiTag, FiAlertCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebaseConnection';
import styles from './modal.module.css';

export default function Modal({ conteudo, buttomBack, onUpdateChamado }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [statusOptions] = useState(['Em aberto', 'Em andamento', 'Concluído', 'Cancelado']);
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    }

    setCurrentStatus(conteudo.status);
    fetchUsers();
  }, [conteudo]);

  const handleAssignUser = async () => {
    if (!selectedUser) return;
    const chamadoRef = doc(db, 'chamados', conteudo.id);
    await updateDoc(chamadoRef, { assignedUser: selectedUser });
    onUpdateChamado({ ...conteudo, assignedUser: selectedUser });
    buttomBack();
  };

  const handleAssignCurrentUser = async () => {
    if (!currentUser) return;
    const userName = currentUser.displayName || currentUser.email;
    const chamadoRef = doc(db, 'chamados', conteudo.id);
    await updateDoc(chamadoRef, { assignedUser: userName });
    onUpdateChamado({ ...conteudo, assignedUser: userName });
    setSelectedUser(userName); 
    buttomBack();
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    const chamadoRef = doc(db, 'chamados', conteudo.id);
    await updateDoc(chamadoRef, { 
      status: newStatus,
      statusUpdatedAt: new Date()
    });
    onUpdateChamado({ ...conteudo, status: newStatus });
    setCurrentStatus(newStatus);
  };

  // Função para obter a cor de fundo do status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Em aberto': return '#ff9800';
      case 'Em andamento': return '#2196f3';
      case 'Concluído': return '#4caf50';
      case 'Cancelado': return '#f44336';
      default: return '#999';
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <button className={styles.btnBack} onClick={buttomBack}>
          <FiX size={23} color='#fff' />
          Voltar
        </button>

        <main className={styles.modalMain}>
          <h2>Detalhes do Chamado</h2>
          
          <div className={styles.ticketHeader}>
            <div className={styles.ticketId}>
              <span>#{conteudo.id?.substring(0, 8)}</span>
            </div>
            <div className={styles.ticketStatus}>
              <span>Status:</span>
              <div className={styles.statusSelector}>
                <div 
                  className={styles.currentStatus}
                  style={{ backgroundColor: getStatusColor(currentStatus) }}
                >
                  {currentStatus}
                </div>
                <div className={styles.statusDropdown}>
                  {statusOptions.map(status => (
                    <div 
                      key={status}
                      className={styles.statusOption}
                      style={{ backgroundColor: getStatusColor(status) }}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ticketSection}>
            <h3>Informações Básicas</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <FiUser className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Cliente</span>
                  <span className={styles.detailValue}>{conteudo.cliente}</span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <FiClock className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Aberto em</span>
                  <span className={styles.detailValue}>{conteudo.createdFormat}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FiMail className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>{conteudo.email || 'Não informado'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FiPhone className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Telefone</span>
                  <span className={styles.detailValue}>{conteudo.telefone || 'Não informado'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FiFolder className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Setor</span>
                  <span className={styles.detailValue}>{conteudo.setor || 'Não informado'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ticketSection}>
            <h3>Informações do Chamado</h3>
            <div className={styles.detailsGrid}>
              <div className={`${styles.detailItem} ${styles.detailItemFullWidth}`}>
                <FiTag className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Assunto</span>
                  <span className={styles.detailValueHighlight}>{conteudo.assunto}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.categoryBadge} style={{ backgroundColor: conteudo.tipo === 'Incidente' ? '#ff5722' : conteudo.tipo === 'Requisição' ? '#4caf50' : '#2196f3' }}>
                  {conteudo.tipo || 'Não definido'}
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={`${styles.categoryBadge} ${styles.categoryType}`}>
                  {conteudo.categoria || 'Não categorizado'}
                </div>
              </div>
            </div>

            <div className={`${styles.detailItem} ${styles.detailItemFullWidth} ${styles.descriptionBox}`}>
              <FiAlertCircle className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Descrição</span>
                <div className={styles.detailDescription}>
                  {conteudo.complemento || 'Sem descrição adicional.'}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.ticketSection} ${styles.assignSection}`}>
            <h3>Atribuição</h3>
            <div className={styles.assignUser}>
              <div className={styles.currentAssignment}>
                <span className={styles.assignmentLabel}>Responsável atual:</span>
                <span className={styles.assignmentValue}>{conteudo.assignedUser || 'Não atribuído'}</span>
              </div>

              <div className={styles.assignControls}>
                <select 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className={styles.userSelect}
                >
                  <option value="">Selecione um técnico</option>
                  {users.map(user => (
                    <option key={user.id} value={user.nome}>{user.nome}</option>
                  ))}
                </select>
                <button className={styles.btnAssign} onClick={handleAssignUser}>
                  Atribuir
                </button>

                <button className={styles.btnSelfAssign} onClick={handleAssignCurrentUser} title="Auto-atribuir">
                  <FiUser size={18} color='#fff' />
                  Atribuir a mim
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}