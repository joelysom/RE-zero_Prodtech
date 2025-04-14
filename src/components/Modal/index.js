import { FiX, FiUser, FiClock, FiPhone, FiMail, FiFolder, FiTag, FiAlertCircle, FiMessageSquare, FiEdit2, FiSave, FiCheck } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebaseConnection';
import styles from './modal.module.css';
import Chat from './chat'; // Importamos o componente Chat
import { toast } from 'react-toastify'; // Importando o toast

export default function Modal({ conteudo, buttomBack, onUpdateChamado }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [statusOptions] = useState(['Em aberto', 'Em andamento', 'Concluído', 'Cancelado']);
  const [currentStatus, setCurrentStatus] = useState('');
  const [chamadoCompleto, setChamadoCompleto] = useState(conteudo);
  
  // Estado para modo de edição
  const [editMode, setEditMode] = useState(false);
  
  // Estados para valores de edição
  const [assuntoEdit, setAssuntoEdit] = useState('');
  const [complementoEdit, setComplementoEdit] = useState('');
  const [categoriaEdit, setCategoriaEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('');
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [tipoOpen, setTipoOpen] = useState(false);
  
  // Estado para controlar a exibição do chat
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verifica se o chamado está finalizado
  const chamadoFinalizado = chamadoCompleto.status === 'Finalizado' || chamadoCompleto.status === 'Concluído';

  // Log para debug
  useEffect(() => {
    console.log("Conteúdo recebido no modal:", conteudo);
    
    // Se temos um ID do chamado, mas faltam campos, carregar diretamente do Firestore
    if (conteudo.id && (!conteudo.tipo || !conteudo.categoria)) {
      console.log("Buscando dados completos do chamado no Firestore...");
      carregarDadosCompletos();
    } else {
      setChamadoCompleto(conteudo);
    }
  }, [conteudo]);

  // Função para carregar dados completos do chamado diretamente do Firestore
  async function carregarDadosCompletos() {
    try {
      const chamadoRef = doc(db, 'chamados', conteudo.id);
      const chamadoSnap = await getDoc(chamadoRef);
      
      if (chamadoSnap.exists()) {
        const dadosCompletos = { 
          id: chamadoSnap.id, 
          ...chamadoSnap.data(),
          createdFormat: conteudo.createdFormat // Mantém o formato de data formatado
        };
        
        console.log("Dados completos carregados:", dadosCompletos);
        setChamadoCompleto(dadosCompletos);
        
        // Atualiza os estados de edição
        setAssuntoEdit(dadosCompletos.assunto || '');
        setComplementoEdit(dadosCompletos.complemento || '');
        setCategoriaEdit(dadosCompletos.categoria || 'REDE');
        setTipoEdit(dadosCompletos.tipo || 'Incidente');
        setCurrentStatus(dadosCompletos.status || 'Em aberto');
      } else {
        console.log("Documento do chamado não encontrado");
        setChamadoCompleto(conteudo);
      }
    } catch (error) {
      console.error("Erro ao carregar dados completos:", error);
      setChamadoCompleto(conteudo);
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Buscar usuários técnicos
        const usersRef = collection(db, 'tecnicos');
        const snapshot = await getDocs(usersRef);
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Técnicos carregados:", userList);
        setUsers(userList);
        
        // Get current auth user
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          setCurrentUser(user);
          console.log("Usuário autenticado:", user);
          
          // Procurar informações do usuário atual no Firestore (coleção 'tecnicos')
          const currentUserData = userList.find(u => u.id === user.uid || u.email === user.email);
          if (currentUserData) {
            console.log("Informações do técnico encontradas:", currentUserData);
            setCurrentUserInfo(currentUserData);
          } else {
            console.log("Informações do técnico não encontradas na coleção");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsers();
  }, []);

  // Atualiza os estados de edição quando chamadoCompleto muda
  useEffect(() => {
    // Inicializa os estados de edição com os valores do chamado
    setAssuntoEdit(chamadoCompleto.assunto || '');
    setComplementoEdit(chamadoCompleto.complemento || '');
    setCategoriaEdit(chamadoCompleto.categoria || 'REDE');
    setTipoEdit(chamadoCompleto.tipo || 'Incidente');
    setCurrentStatus(chamadoCompleto.status || 'Em aberto');
    
    console.log("Estados atualizados - Categoria:", chamadoCompleto.categoria, "Tipo:", chamadoCompleto.tipo);
  }, [chamadoCompleto]);

  // Verifica se o técnico atual está atribuído ao chamado
  const isAssignedToMe = currentUser && chamadoCompleto.assignedUser === (currentUser.displayName || currentUser.email);

  function abrirChat() {
    if (!chamadoCompleto.assignedUser || chamadoCompleto.assignedUser === 'Não atribuído') {
      toast.info("Este chamado não tem técnico atribuído. Atribua um técnico para iniciar o chat.");
      return;
    }
    setChatOpen(true);
  }

  function fecharChat() {
    setChatOpen(false);
  }

  const handleAssignUser = async () => {
    if (!selectedUser) return;
    const chamadoRef = doc(db, 'chamados', chamadoCompleto.id);
    await updateDoc(chamadoRef, { assignedUser: selectedUser });
    
    const chamadoAtualizado = { ...chamadoCompleto, assignedUser: selectedUser };
    setChamadoCompleto(chamadoAtualizado);
    
    if (onUpdateChamado) {
      onUpdateChamado(chamadoAtualizado);
    }
    
    toast.success("Chamado atribuído com sucesso!");
    buttomBack();
  };

  const handleAssignCurrentUser = async () => {
    if (!currentUser) return;
    
    // Usar o nome do técnico do Firestore em vez do displayName/email do Auth
    let userName;
    
    // Verificar se temos os dados do usuário do Firestore
    if (currentUserInfo && currentUserInfo.nome) {
      userName = currentUserInfo.nome;
      console.log("Atribuindo chamado ao técnico pelo nome do Firestore:", userName);
    } else {
      // Buscar diretamente do array de usuários como backup
      const userFromList = users.find(user => user.id === currentUser.uid);
      userName = userFromList?.nome || currentUser.displayName || currentUser.email;
      console.log("Atribuindo chamado ao técnico (fallback):", userName);
    }
    
    const chamadoRef = doc(db, 'chamados', chamadoCompleto.id);
    await updateDoc(chamadoRef, { 
      assignedUser: userName,
      tecnicoId: currentUser.uid // Salvamos também o ID do técnico
    });
    
    const chamadoAtualizado = { 
      ...chamadoCompleto, 
      assignedUser: userName, 
      tecnicoId: currentUser.uid 
    };
    
    setChamadoCompleto(chamadoAtualizado);
    
    if (onUpdateChamado) {
      onUpdateChamado(chamadoAtualizado);
    }
    
    toast.success("Chamado atribuído a você com sucesso!");
    setSelectedUser(userName); 
    buttomBack();
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    const chamadoRef = doc(db, 'chamados', chamadoCompleto.id);
    await updateDoc(chamadoRef, { 
      status: newStatus,
      statusUpdatedAt: new Date()
    });
    
    const chamadoAtualizado = { ...chamadoCompleto, status: newStatus };
    setChamadoCompleto(chamadoAtualizado);
    
    if (onUpdateChamado) {
      onUpdateChamado(chamadoAtualizado);
    }
    
    toast.success(`Status atualizado para ${newStatus}`);
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
  
  function toggleEditMode() {
    if (chamadoFinalizado) {
      toast.info("Não é possível editar um chamado finalizado.");
      return;
    }
    setEditMode(!editMode);
    
    // Reset dos estados de edição para os valores originais quando sai do modo de edição
    if (editMode) {
      setAssuntoEdit(chamadoCompleto.assunto || '');
      setComplementoEdit(chamadoCompleto.complemento || '');
      setCategoriaEdit(chamadoCompleto.categoria || 'REDE');
      setTipoEdit(chamadoCompleto.tipo || 'Incidente');
    }
  }
  
  async function salvarEdicao() {
    if (assuntoEdit.trim() === '') {
      toast.error("O assunto não pode estar vazio.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Referência ao documento do chamado
      const chamadoRef = doc(db, 'chamados', chamadoCompleto.id);
      
      // Dados atualizados
      const dadosAtualizados = {
        assunto: assuntoEdit,
        complemento: complementoEdit,
        categoria: categoriaEdit,
        tipo: tipoEdit,
        // Adicionamos um campo para marcar que foi editado pelo técnico
        editadoPorTecnico: true,
        dataEdicao: serverTimestamp()
      };
      
      // Atualiza o documento no Firestore
      await updateDoc(chamadoRef, dadosAtualizados);
      
      // Atualizamos o objeto local também, para evitar recarregar a página
      const chamadoAtualizado = {
        ...chamadoCompleto,
        ...dadosAtualizados
      };
      
      setChamadoCompleto(chamadoAtualizado);
      
      // Notifica o componente pai sobre a atualização
      if (onUpdateChamado) {
        onUpdateChamado(chamadoAtualizado);
      }
      
      toast.success("Chamado atualizado com sucesso!");
      setEditMode(false);
      
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error);
      toast.error("Erro ao atualizar chamado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }
  
  // Funções para manipular as opções de tipo e categoria
  function handleTipoSelect(valor) {
    setTipoEdit(valor);
    setTipoOpen(false);
  }
  
  function handleCategoriaSelect(valor) {
    setCategoriaEdit(valor);
    setCategoriaOpen(false);
  }

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <button className={styles.btnBack} onClick={buttomBack}>
          <FiX size={23} color='#fff' />
          Voltar
        </button>

        <main className={styles.modalMain}>
          <div className={styles.headerWithChat}>
            <h2>{editMode ? 'Editar Chamado' : 'Detalhes do Chamado'}</h2>
            <div className={styles.actionButtons}>
              {!editMode && !chamadoFinalizado && (
                <button 
                  className={styles.editButton} 
                  onClick={toggleEditMode}
                  title="Editar chamado"
                >
                  <FiEdit2 size={20} color="#4a4a4a" />
                </button>
              )}
              {!editMode && (
                <button 
                  className={styles.chatButton} 
                  onClick={abrirChat}
                  title={chamadoCompleto.assignedUser ? "Abrir chat com cliente" : "Não há técnico atribuído"}
                >
                  <FiMessageSquare 
                    size={22} 
                    color={chamadoCompleto.assignedUser ? '#2196f3' : '#999'}
                  />
                </button>
              )}
              {editMode && (
                <div className={styles.editActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.saveButton}`} 
                    onClick={salvarEdicao}
                    disabled={loading}
                  >
                    <FiSave size={20} color="#fff" />
                    Salvar
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.cancelButton}`} 
                    onClick={toggleEditMode}
                  >
                    <FiX size={20} color="#fff" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.ticketHeader}>
            <div className={styles.ticketId}>
              <span>#{chamadoCompleto.id?.substring(0, 8)}</span>
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
                  <span className={styles.detailValue}>{chamadoCompleto.cliente}</span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <FiClock className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Aberto em</span>
                  <span className={styles.detailValue}>{chamadoCompleto.createdFormat}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FiMail className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>{chamadoCompleto.email || 'Não informado'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FiPhone className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Telefone</span>
                  <span className={styles.detailValue}>{chamadoCompleto.telefone || 'Não informado'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FiFolder className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Setor</span>
                  <span className={styles.detailValue}>{chamadoCompleto.setor || 'Não informado'}</span>
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
                  {editMode ? (
                    <input
                      type="text"
                      className={styles.editInput}
                      value={assuntoEdit}
                      onChange={(e) => setAssuntoEdit(e.target.value)}
                      placeholder="Informe o assunto do chamado"
                    />
                  ) : (
                    <span className={styles.detailValueHighlight}>{chamadoCompleto.assunto}</span>
                  )}
                </div>
              </div>

              <div className={styles.detailItem}>
                {editMode ? (
                  <div className={styles.dropdownContainer}>
                    <span className={styles.detailLabel}>Tipo</span>
                    <div 
                      className={`${styles.dropdown} ${tipoOpen ? styles.open : ''}`}
                      onClick={() => setTipoOpen(!tipoOpen)}
                    >
                      <span>{tipoEdit}</span>
                      <FiCheck size={16} className={styles.dropdownIcon} />
                      
                      {tipoOpen && (
                        <div className={styles.dropdownOptions}>
                          <div className={styles.dropdownOption} onClick={() => handleTipoSelect("Incidente")}>
                            Incidente
                          </div>
                          <div className={styles.dropdownOption} onClick={() => handleTipoSelect("Requisição")}>
                            Requisição
                          </div>
                          <div className={styles.dropdownOption} onClick={() => handleTipoSelect("Dúvida")}>
                            Dúvida
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className={styles.detailLabel}>Tipo</span>
                    <div className={styles.categoryBadge} style={{ backgroundColor: chamadoCompleto.tipo === 'Incidente' ? '#ff5722' : chamadoCompleto.tipo === 'Requisição' ? '#4caf50' : '#2196f3' }}>
                      {chamadoCompleto.tipo || 'Não definido'}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.detailItem}>
                {editMode ? (
                  <div className={styles.dropdownContainer}>
                    <span className={styles.detailLabel}>Categoria</span>
                    <div 
                      className={`${styles.dropdown} ${categoriaOpen ? styles.open : ''}`}
                      onClick={() => setCategoriaOpen(!categoriaOpen)}
                    >
                      <span>{categoriaEdit}</span>
                      <FiCheck size={16} className={styles.dropdownIcon} />
                      
                      {categoriaOpen && (
                        <div className={styles.dropdownOptions}>
                          <div className={styles.dropdownOption} onClick={() => handleCategoriaSelect("REDE")}>
                            REDE
                          </div>
                          <div className={styles.dropdownOption} onClick={() => handleCategoriaSelect("HARDWARE")}>
                            HARDWARE
                          </div>
                          <div className={styles.dropdownOption} onClick={() => handleCategoriaSelect("SOFTWARE")}>
                            SOFTWARE
                          </div>
                          <div className={styles.dropdownOption} onClick={() => handleCategoriaSelect("OUTRO")}>
                            OUTRO
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className={styles.detailLabel}>Categoria</span>
                    <div className={`${styles.categoryBadge} ${styles.categoryType}`}>
                      {chamadoCompleto.categoria || 'Não categorizado'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.detailItem} ${styles.detailItemFullWidth} ${styles.descriptionBox}`}>
              <FiAlertCircle className={styles.detailIcon} />
              <div style={{ width: '100%' }}>
                <span className={styles.detailLabel}>Descrição</span>
                {editMode ? (
                  <textarea
                    className={styles.editTextarea}
                    value={complementoEdit}
                    onChange={(e) => setComplementoEdit(e.target.value)}
                    placeholder="Descreva os detalhes do chamado"
                    rows={5}
                  />
                ) : (
                  <div className={styles.detailDescription}>
                    {chamadoCompleto.complemento || 'Sem descrição adicional.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.ticketSection} ${styles.assignSection}`}>
            <h3>Atribuição</h3>
            <div className={styles.assignUser}>
              <div className={styles.currentAssignment}>
                <span className={styles.assignmentLabel}>Responsável atual:</span>
                <span className={styles.assignmentValue}>{chamadoCompleto.assignedUser || 'Não atribuído'}</span>
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

        {/* Componente Chat */}
        {chatOpen && (
          <Chat 
            chamado={chamadoCompleto} 
            currentUser={currentUser}
            onClose={fecharChat}
          />
        )}
      </div>
    </div>
  );
}