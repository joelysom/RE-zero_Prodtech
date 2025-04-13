import { FiX, FiMessageSquare, FiEdit2, FiSave, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection'; // Ajuste o caminho conforme necessário
import { toast } from 'react-toastify';
import Chat from './chat'; // Importando o componente de chat
import styles from './ClientModal.module.css';

export default function ClientModal({ conteudo, buttomBack, onUpdateChamado }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para edição
  const [assuntoEdit, setAssuntoEdit] = useState(conteudo.assunto || '');
  const [complementoEdit, setComplementoEdit] = useState(conteudo.complemento || '');
  const [categoriaEdit, setCategoriaEdit] = useState(conteudo.categoria || '');
  const [tipoEdit, setTipoEdit] = useState(conteudo.tipo || '');
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [tipoOpen, setTipoOpen] = useState(false);

  // Verifica se tem técnico atribuído
  const temTecnicoAtribuido = conteudo.assignedUser && conteudo.assignedUser !== 'Não atribuído';
  
  // Verifica se o chamado está finalizado
  const chamadoFinalizado = conteudo.status === 'Finalizado' || conteudo.status === 'Concluído';

  function abrirChat() {
    if (!temTecnicoAtribuido) {
      toast.info("Não há técnico atribuído para este chamado. Não é possível iniciar o chat.");
      return;
    }
    setChatOpen(true);
  }

  function fecharChat() {
    setChatOpen(false);
  }
  
  function toggleEditMode() {
    if (chamadoFinalizado) {
      toast.info("Não é possível editar um chamado finalizado.");
      return;
    }
    setEditMode(!editMode);
    
    // Reset dos estados de edição para os valores originais quando sai do modo de edição
    if (editMode) {
      setAssuntoEdit(conteudo.assunto || '');
      setComplementoEdit(conteudo.complemento || '');
      setCategoriaEdit(conteudo.categoria || '');
      setTipoEdit(conteudo.tipo || '');
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
      const chamadoRef = doc(db, "chamados", conteudo.id);
      
      // Dados atualizados
      const dadosAtualizados = {
        assunto: assuntoEdit,
        complemento: complementoEdit,
        categoria: categoriaEdit,
        tipo: tipoEdit,
        // Adicionamos um campo para marcar que foi editado pelo cliente
        editadoPorCliente: true,
        dataEdicao: serverTimestamp()
      };
      
      // Atualiza o documento no Firestore
      await updateDoc(chamadoRef, dadosAtualizados);
      
      // Atualizamos o objeto local também, para evitar recarregar a página
      const chamadoAtualizado = {
        ...conteudo,
        ...dadosAtualizados
      };
      
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
          <FiX size={20} color='#fff' />
          Voltar
        </button>
        <main className={styles.main}>
          <div className={styles.headerContainer}>
            <h3 className={styles.sectionTitle}>
              {editMode ? 'Editar Chamado' : 'Detalhes do Chamado'}
            </h3>
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
                  title={temTecnicoAtribuido ? "Abrir chat com técnico" : "Não há técnico atribuído"}
                  disabled={!temTecnicoAtribuido}
                >
                  <FiMessageSquare 
                    size={22} 
                    color={temTecnicoAtribuido ? '#2196f3' : '#999'}
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
          
          {/* Cliente (não editável) */}
          <div className={styles.infoField}>
            <div className={styles.infoFieldContent}>
              <span className={styles.infoFieldLabel}>Cliente</span>
              <span className={styles.infoFieldValue}>{conteudo.cliente}</span>
            </div>
          </div>
          
          {/* Assunto (editável) */}
          <div className={styles.infoField}>
            <div className={styles.infoFieldContent}>
              <span className={styles.infoFieldLabel}>Assunto</span>
              {editMode ? (
                <input
                  type="text"
                  className={styles.editInput}
                  value={assuntoEdit}
                  onChange={(e) => setAssuntoEdit(e.target.value)}
                  placeholder="Informe o assunto do chamado"
                />
              ) : (
                <span className={styles.infoFieldValue}>{conteudo.assunto}</span>
              )}
            </div>
          </div>
          
          {/* Data (não editável) */}
          <div className={styles.infoField}>
            <div className={styles.infoFieldContent}>
              <span className={styles.infoFieldLabel}>Cadastrado em</span>
              <span className={styles.infoFieldValue}>{conteudo.createdFormat}</span>
            </div>
          </div>
          
          {/* Status (não editável pelo cliente) */}
          <div className={styles.infoField}>
            <div className={styles.infoFieldContent}>
              <span className={styles.infoFieldLabel}>Status</span>
              <span
                className={`${styles.badge} ${styles.status}`}
                style={{
                  backgroundColor: conteudo.status === 'Em aberto' ? '#5cb85c' :
                               conteudo.status === 'Em andamento' ? '#2196f3' :
                               conteudo.status === 'Finalizado' || conteudo.status === 'Concluído' ? '#4caf50' : '#999'
                }}
              >
                {conteudo.status}
              </span>
            </div>
          </div>
          
          {/* Tipo (editável) */}
          {(conteudo.tipo || editMode) && (
            <div className={styles.infoField}>
              <div className={styles.infoFieldContent}>
                <span className={styles.infoFieldLabel}>Tipo</span>
                {editMode ? (
                  <div className={styles.dropdownContainer}>
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
                  <span className={`${styles.badge} ${styles.type}`}>
                    {conteudo.tipo}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Categoria (editável) */}
          {(conteudo.categoria || editMode) && (
            <div className={styles.infoField}>
              <div className={styles.infoFieldContent}>
                <span className={styles.infoFieldLabel}>Categoria</span>
                {editMode ? (
                  <div className={styles.dropdownContainer}>
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
                  <span className={`${styles.badge} ${styles.category}`}>
                    {conteudo.categoria}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Complemento/Descrição (editável) */}
          <div className={styles.infoField}>
            <div className={styles.infoFieldContent}>
              <span className={styles.infoFieldLabel}>Complemento</span>
              {editMode ? (
                <textarea
                  className={styles.editTextarea}
                  value={complementoEdit}
                  onChange={(e) => setComplementoEdit(e.target.value)}
                  placeholder="Descreva os detalhes do chamado"
                  rows={5}
                />
              ) : (
                <div className={styles.infoDescription}>
                  {conteudo.complemento}
                </div>
              )}
            </div>
          </div>
          
          {/* Técnico atribuído (não editável) */}
          <div className={styles.infoField}>
            <div className={styles.infoFieldContent}>
              <span className={styles.infoFieldLabel}>Atribuído a</span>
              <span className={styles.infoFieldValue}>{conteudo.assignedUser || 'Não atribuído'}</span>
            </div>
          </div>
        </main>

        {/* Componente de Chat */}
        {chatOpen && (
          <Chat 
            chamado={conteudo}
            onClose={fecharChat}
          />
        )}
      </div>
    </div>
  );
}