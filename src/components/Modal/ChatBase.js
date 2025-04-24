// Em ChatBase.js, adicione estado para gerenciar o tema
import { useState, useEffect, useRef } from 'react';
import { FiX, FiPaperclip, FiSend, FiSmile, FiImage, FiFile, FiCheck, FiSettings } from 'react-icons/fi';
import { FaCheckDouble, FaPalette } from "react-icons/fa";
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebaseConnection';
import EmojiPicker from 'emoji-picker-react';
import styles from './ChatStyles.module.css';

export default function ChatBase({
  chamado,
  currentUser,
  onClose,
  userType, // 'tecnico' ou 'cliente'
  chatStyles = styles // Permite personalização de estilos
}) {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recentlySent, setRecentlySent] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [otherUserId, setOtherUserId] = useState('');
  const [currentTheme, setCurrentTheme] = useState('defaultTheme'); // Tema padrão
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const chatMessagesRef = useRef(null);
  const userId = currentUser?.uid || '';
  const otherUserName = userType === 'tecnico' ? chamado.cliente : (chamado.assignedUser || 'Técnico');
  
  // Lista de temas disponíveis
  const themes = [
    { id: 'defaultTheme', name: 'Padrão' },
    { id: 'darkModernTheme', name: 'Preto Moderno' },
    { id: 'lightModernTheme', name: 'Branco Moderno' },
    { id: 'blueTheme', name: 'Azul' },
    { id: 'purpleTheme', name: 'Roxo' },
    { id: 'greenTheme', name: 'Verde' },
    { id: 'orangeTheme', name: 'Laranja' }
  ];
  
  // Carregar tema salvo do localStorage quando o componente monta
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  
  // Salvar tema no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('chatTheme', currentTheme);
  }, [currentTheme]);
  
  // Determinar o ID do outro usuário quando o componente carregar
  useEffect(() => {
    const determineOtherUserId = async () => {
      if (userType === 'tecnico') {
        // Se for um técnico, o outro usuário é o cliente
        setOtherUserId(chamado.clienteId || '');
      } else {
        // Se for um cliente, precisamos determinar quem é o técnico
        if (chamado.tecnicoId) {
          setOtherUserId(chamado.tecnicoId);
        } else if (chamado.userId) {
          setOtherUserId(chamado.userId);
        } else {
          // Se não houver técnico atribuído, podemos usar uma string vazia ou buscar no banco de dados
          try {
            if (chamado.id) {
              // Verificar se existe alguma mensagem de um técnico
              const chatQuery = query(
                collection(db, "chat"),
                where("chamadoId", "==", chamado.id),
                where("remetente", "==", "tecnico")
              );
              
              const chatSnapshot = await getDocs(chatQuery);
              if (!chatSnapshot.empty) {
                // Usar o tecnicoId da primeira mensagem encontrada
                const tecnicoId = chatSnapshot.docs[0].data().tecnicoId;
                if (tecnicoId) {
                  setOtherUserId(tecnicoId);
                  return;
                }
              }
            }
            
            // Se não encontrar nada, definir como string vazia
            setOtherUserId('');
          } catch (error) {
            console.error("Erro ao determinar ID do técnico:", error);
            setOtherUserId('');
          }
        }
      }
    };
    
    determineOtherUserId();
  }, [chamado, userType]);
  
  // Carrega mensagens quando o componente é montado
  useEffect(() => {
    if (chamado.id) {
      const unsubscribe = carregarMensagens();
      
      // Configurar listener para status de digitação apenas se tivermos otherUserId
      let typingUnsubscribe = () => {};
      
      if (otherUserId) {
        const typingRef = query(
          collection(db, "typing"),
          where("chamadoId", "==", chamado.id),
          where("userId", "==", otherUserId)
        );
        
        typingUnsubscribe = onSnapshot(typingRef, (snapshot) => {
          if (!snapshot.empty) {
            const typingData = snapshot.docs[0].data();
            setIsTyping(typingData.isTyping && Date.now() - typingData.timestamp.toDate() < 10000);
          } else {
            setIsTyping(false);
          }
        });
      }
      
      return () => {
        unsubscribe();
        typingUnsubscribe();
      };
    }
  }, [chamado.id, otherUserId]);
  
  // Scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);
  
  // Atualizar status de leitura das mensagens
  useEffect(() => {
    if (mensagens.length > 0 && chamado.id) {
      atualizarMensagensLidas();
    }
  }, [mensagens]);
  
  function carregarMensagens() {
    try {
      // Cria uma consulta para buscar mensagens baseadas no ID do chamado
      const q = query(
        collection(db, "chat"),
        where("chamadoId", "==", chamado.id),
        orderBy("dataCriacao", "asc")
      );

      // Configura um listener para atualizações em tempo real
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const listaMensagens = [];
        querySnapshot.forEach((doc) => {
          listaMensagens.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setMensagens(listaMensagens);
      });

      // Retorna a função de limpeza
      return unsubscribe;
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      return () => {};
    }
  }
  
  async function atualizarMensagensLidas() {
    try {
      const mensagensNaoLidas = mensagens.filter(
        msg => msg.remetente !== userType && !msg.lido
      );
      
      for (const msg of mensagensNaoLidas) {
        await updateDoc(doc(db, "chat", msg.id), {
          lido: true,
          dataLeitura: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar status de leitura:", error);
    }
  }
  
  // Função para atualizar status de digitação
  async function atualizarStatusDigitacao(estaDigitando) {
    try {
      const typingRef = query(
        collection(db, "typing"),
        where("chamadoId", "==", chamado.id),
        where("userId", "==", userId)
      );
      
      const typingSnapshot = await getDocs(typingRef);
      
      if (typingSnapshot.empty) {
        await addDoc(collection(db, "typing"), {
          chamadoId: chamado.id,
          userId: userId,
          isTyping: estaDigitando,
          timestamp: serverTimestamp()
        });
      } else {
        const docId = typingSnapshot.docs[0].id;
        await updateDoc(doc(db, "typing", docId), {
          isTyping: estaDigitando,
          timestamp: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar status de digitação:", error);
    }
  }
  
  function handleInputChange(e) {
    setNovaMensagem(e.target.value);
    
    // Atualizar status de digitação
    atualizarStatusDigitacao(true);
    
    // Limpar qualquer timeout existente
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Definir novo timeout para parar de digitar
    typingTimeoutRef.current = setTimeout(() => {
      atualizarStatusDigitacao(false);
    }, 2000);
  }
  
  function handleEmojiClick(emojiData) {
    setNovaMensagem(prev => prev + emojiData.emoji);
  }
  
  async function enviarMensagem(e) {
    e.preventDefault();
    
    if (novaMensagem.trim() === '' && !recentlySent) return;
    
    try {
      // Verificamos se existem os IDs necessários
      const chamadoId = chamado.id || '';
      const clienteId = chamado.clienteId || '';
      const tecnicoId = userType === 'tecnico' ? userId : (otherUserId || '');
      
      // Adiciona a mensagem na coleção "chat"
      await addDoc(collection(db, "chat"), {
        chamadoId: chamadoId,
        clienteId: clienteId,
        tecnicoId: tecnicoId,
        mensagem: novaMensagem,
        remetente: userType,
        dataCriacao: serverTimestamp(),
        lido: false,
        tipo: 'texto'
      });

      setNovaMensagem('');
      setShowEmojiPicker(false);
      atualizarStatusDigitacao(false);
      
      // Evita múltiplos envios acidentais
      setRecentlySent(true);
      setTimeout(() => setRecentlySent(false), 1000);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    }
  }
  
  function handleFileOption() {
    setShowFileOptions(!showFileOptions);
  }
  
  function handleFileSelect(e, tipo) {
    const file = e.target.files[0];
    if (!file) return;
    
    uploadFile(file, tipo);
  }
  
  async function uploadFile(file, tipo) {
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`O arquivo é muito grande. O tamanho máximo é 10MB.`);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Criar referência para o arquivo no storage
      const storageRef = ref(storage, `chat/${chamado.id}/${Date.now()}_${file.name}`);
      
      // Iniciar upload
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Monitorar progresso do upload
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Erro no upload:", error);
          alert("Erro ao enviar arquivo. Tente novamente.");
          setIsUploading(false);
        },
        async () => {
          // Upload completo, obter URL de download
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Adicionar mensagem com arquivo
          await addDoc(collection(db, "chat"), {
            chamadoId: chamado.id,
            clienteId: chamado.clienteId || '',
            tecnicoId: userType === 'tecnico' ? userId : (otherUserId || ''),
            mensagem: file.name,
            remetente: userType,
            dataCriacao: serverTimestamp(),
            lido: false,
            tipo: tipo,
            arquivo: {
              nome: file.name,
              tamanho: file.size,
              tipo: file.type,
              url: downloadURL
            }
          });
          
          setIsUploading(false);
          setShowFileOptions(false);
        }
      );
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      alert("Erro ao processar arquivo. Tente novamente.");
      setIsUploading(false);
    }
  }
  
  function renderFileMessage(msg) {
    const { arquivo, tipo } = msg;
    
    // Check if arquivo is defined before accessing its properties
    if (!arquivo) {
      return <div className={chatStyles.filePreview}>Arquivo não disponível</div>;
    }
    
    if (tipo === 'imagem') {
      return (
        <div className={chatStyles.filePreview}>
          <img 
            src={arquivo.url} 
            alt={arquivo.nome} 
            className={chatStyles.imagePreview}
            onClick={() => window.open(arquivo.url, '_blank')}
          />
          <div className={chatStyles.fileName}>{arquivo.nome}</div>
        </div>
      );
    } else {
      return (
        <div className={chatStyles.filePreview}>
          <FiFile size={40} className={chatStyles.fileIcon} />
          <div className={chatStyles.fileInfo}>
            <div className={chatStyles.fileName}>{arquivo.nome}</div>
            <div className={chatStyles.fileSize}>{formatFileSize(arquivo.tamanho)}</div>
            <a 
              href={arquivo.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={chatStyles.downloadLink}
            >
              Baixar
            </a>
          </div>
        </div>
      );
    }
  }
  
  // Função para formatar o tamanho do arquivo
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }
  
  // Formatar data no estilo do WhatsApp
  function formatMessageTime(data) {
    if (!data) return '';
    
    const messageDate = data.toDate();
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    
    const options = { hour: '2-digit', minute: '2-digit' };
    
    if (isToday) {
      return messageDate.toLocaleTimeString('pt-BR', options);
    } else if (isYesterday) {
      return `Ontem ${messageDate.toLocaleTimeString('pt-BR', options)}`;
    } else {
      return `${messageDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${messageDate.toLocaleTimeString('pt-BR', options)}`;
    }
  }
  
  // Função para alterar o tema
  function changeTheme(themeId) {
    setCurrentTheme(themeId);
    setShowThemeSelector(false);
  }

  return (
    <div className={`${chatStyles.chatModalOverlay} ${chatStyles[currentTheme]}`}>
      <div className={chatStyles.chatModal}>
        <div className={chatStyles.chatHeader}>
          <div className={chatStyles.userInfo}>
            <div className={chatStyles.userAvatar}>
              {otherUserName.charAt(0).toUpperCase()}
            </div>
            <div className={chatStyles.headerInfo}>
              <h4>{otherUserName}</h4>
              {isTyping ? (
                <span className={chatStyles.typingIndicator}>digitando...</span>
              ) : (
                <span className={chatStyles.statusIndicator}>
                  {userType === 'tecnico' ? 'Cliente' : 'Técnico'}
                </span>
              )}
            </div>
          </div>
          <div className={chatStyles.headerActions}>
            {/* Botão de temas */}
            <button 
              onClick={() => setShowThemeSelector(!showThemeSelector)} 
              className={chatStyles.themeButton} 
              title="Alterar tema"
            >
              <FaPalette size={18} />
            </button>
            
            {/* Seletor de temas */}
            {showThemeSelector && (
              <div className={chatStyles.themeSelector}>
                <div className={chatStyles.themeSelectorHeader}>
                  Escolha um tema
                </div>
                <div className={chatStyles.themeOptions}>
                  {themes.map(theme => (
                    <div 
                      key={theme.id}
                      className={`${chatStyles.themeOption} ${currentTheme === theme.id ? chatStyles.activeTheme : ''}`}
                      onClick={() => changeTheme(theme.id)}
                    >
                      <div className={`${chatStyles.themePreview} ${chatStyles[`${theme.id}Preview`]}`}></div>
                      <span>{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              onClick={onClose} 
              className={chatStyles.closeChat} 
              title="Fechar chat"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        
        <div className={chatStyles.chatMessages} ref={chatMessagesRef}>
          {mensagens.length === 0 ? (
            <div className={chatStyles.noMessages}>
              Nenhuma mensagem ainda. Inicie a conversa!
            </div>
          ) : (
            <>
              {mensagens.map((msg, index) => {
                // Verificar se é necessário mostrar data
                const showDate = index === 0 || 
                  (index > 0 && 
                   msg.dataCriacao && 
                   mensagens[index-1].dataCriacao && 
                   new Date(msg.dataCriacao.toDate()).toDateString() !== 
                   new Date(mensagens[index-1].dataCriacao.toDate()).toDateString());
                
                return (
                  <div key={msg.id}>
                    {showDate && msg.dataCriacao && (
                      <div className={chatStyles.dateHeader}>
                        {new Date(msg.dataCriacao.toDate()).toLocaleDateString('pt-BR', {
                          day: '2-digit', 
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                    <div 
                      className={`${chatStyles.messageItem} ${
                        msg.remetente === userType ? 
                          chatStyles.ownMessage : 
                          chatStyles.otherMessage
                      }`}
                    >
                      <div className={chatStyles.messageContent}>
                        {msg.tipo === 'texto' ? (
                          <p>{msg.mensagem}</p>
                        ) : (
                          renderFileMessage(msg)
                        )}
                        <div className={chatStyles.messageFooter}>
                          <span className={chatStyles.messageTime}>
                            {msg.dataCriacao ? formatMessageTime(msg.dataCriacao) : ''}
                          </span>
                          {msg.remetente === userType && (
                            <span className={chatStyles.messageStatus}>
                              {msg.lido ? (
                                <FaCheckDouble size={14} className={chatStyles.readIcon} />
                              ) : (
                                <FiCheck size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
          
          {isUploading && (
            <div className={chatStyles.uploadProgress}>
              <div className={chatStyles.progressBar}>
                <div 
                  className={chatStyles.progressFill} 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className={chatStyles.progressText}>
                Enviando arquivo... {Math.round(uploadProgress)}%
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={enviarMensagem} className={chatStyles.messageForm}>
          <div className={chatStyles.messageInputWrapper}>
            <button 
              type="button" 
              className={chatStyles.emojiButton}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FiSmile size={20} />
            </button>
            
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={handleInputChange}
              className={chatStyles.messageInput}
            />
            
            <button 
              type="button" 
              className={chatStyles.attachButton}
              onClick={handleFileOption}
            >
              <FiPaperclip size={20} />
            </button>
            
            {showFileOptions && (
              <div className={chatStyles.fileOptions}>
                <button 
                  type="button"
                  className={chatStyles.fileOption}
                  onClick={() => imageInputRef.current.click()}
                >
                  <FiImage size={20} />
                  <span>Imagem</span>
                </button>
                <button 
                  type="button"
                  className={chatStyles.fileOption}
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiFile size={20} />
                  <span>Documento</span>
                </button>
              </div>
            )}
            
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'imagem')}
              style={{ display: 'none' }}
            />
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={(e) => handleFileSelect(e, 'documento')}
              style={{ display: 'none' }}
            />
          </div>
          
          <button type="submit" className={chatStyles.sendButton} disabled={isUploading || recentlySent}>
            <FiSend size={20} />
          </button>
          
          {showEmojiPicker && (
            <div className={chatStyles.emojiPickerWrapper}>
              <EmojiPicker 
                onEmojiClick={handleEmojiClick} 
                width="100%" 
                height="350px"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}