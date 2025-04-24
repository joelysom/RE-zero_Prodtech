import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiSearch, 
  FiEye, 
  FiFilter,
  FiX,
  FiTrash
} from 'react-icons/fi';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import ClientSidebar from '../../components/ClientHeader';
import ClientModal from '../../components/ClientModal';

// Import CSS module
import styles from './client-dashboard.module.css';

export default function ClientDashboard() {
  const { user } = useContext(AuthContext);
  
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredChamados, setFilteredChamados] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chamadoToDelete, setChamadoToDelete] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    
    if(user) {
      setLoading(true);
      
      const chamadosRef = collection(db, 'chamados');
      
      // Configurando listener em tempo real
      unsubscribe = onSnapshot(chamadosRef, (snapshot) => {
        if (snapshot.empty) {
          setIsEmpty(true);
          setChamados([]);
          setFilteredChamados([]);
          setLoading(false);
          return;
        }
        
        const listaChamados = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          if (data.clienteId === user.uid || data.userId === user.uid) {
            listaChamados.push({
              id: doc.id,
              assunto: data.assunto || '',
              cliente: data.cliente || '',
              clienteId: data.clienteId || '',
              created: data.created,
              createdFormat: format(data.created.toDate(), 'dd/MM/yyyy'),
              status: data.status || '',
              complemento: data.complemento || '',
              tipo: data.tipo || '',
              categoria: data.categoria || '',
              assignedUser: data.assignedUser || 'Não atribuído',
            });
          }
        });
        
        listaChamados.sort((a, b) => b.created - a.created);
        
        setChamados(listaChamados);
        setIsEmpty(listaChamados.length === 0);
        setLoading(false);
        
        console.log('Chamados atualizados em tempo real:', listaChamados.length);
      }, (error) => {
        console.error("Erro no listener de chamados:", error);
        toast.error("Erro ao monitorar chamados!");
        setLoading(false);
      });
    }
    
    // Cleanup function para remover o listener quando o componente for desmontado
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [chamados, statusFilter, searchTerm]);

  function applyFilters() {
    if (!chamados.length) {
      setFilteredChamados([]);
      return;
    }
    
    let results = [...chamados];
    
    if (statusFilter !== 'all') {
      results = results.filter(chamado => chamado.status === statusFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(chamado => 
        (chamado.assunto && chamado.assunto.toLowerCase().includes(searchLower)) ||
        (chamado.cliente && chamado.cliente.toLowerCase().includes(searchLower)) ||
        (chamado.categoria && chamado.categoria.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredChamados(results);
  }
  
  function togglePostModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  function confirmDelete(chamado) {
    setChamadoToDelete(chamado);
    setShowDeleteConfirm(true);
  }

  async function handleDeleteChamado() {
    if (!chamadoToDelete) return;
    
    try {
      const docRef = doc(db, 'chamados', chamadoToDelete.id);
      await deleteDoc(docRef);
      
      // Fechar o modal de confirmação
      setShowDeleteConfirm(false);
      setChamadoToDelete(null);
      
      toast.success("Chamado deletado com sucesso!");
      
      // Não precisamos mais atualizar manualmente a lista aqui
      // já que o listener onSnapshot vai detectar essa mudança automaticamente
    } catch (error) {
      console.error("Erro ao deletar chamado:", error);
      toast.error("Erro ao deletar chamado!");
    }
  }

  // Modal de confirmação de exclusão
  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h2>Confirmar exclusão</h2>
          <p>Tem certeza que deseja excluir o chamado "{chamadoToDelete?.assunto}"?</p>
          <p>Esta ação não pode ser desfeita.</p>
          
          <div className={styles.modalActions}>
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              onClick={handleDeleteChamado}
              className={styles.deleteButton}
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <ClientSidebar />
      
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <h1>Meus Chamados</h1>
          
          <Link to="/new" className={styles.newLink}>
            <FiPlus size={25} />
            Novo Chamado
          </Link>
        </div>
        
        <div className={styles.filterContainer}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Buscar chamado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton}>
              <FiSearch size={20} color="#FFF" />
            </button>
          </div>
          
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <FiFilter size={20} color="#FFF" />
            Filtrar
          </button>
          
          {showFilterModal && (
            <div className={styles.filterModal}>
              <div className={styles.filterHeader}>
                <h3>Filtros</h3>
                <button onClick={() => setShowFilterModal(false)}>
                  <FiX size={18} />
                </button>
              </div>
              
              <div className={styles.filterOptions}>
                <label>Status:</label>
                <div className={styles.radioGroup}>
                  <label>
                    <input 
                      type="radio"
                      name="status"
                      value="all"
                      checked={statusFilter === 'all'}
                      onChange={() => setStatusFilter('all')}
                    />
                    Todos
                  </label>
                  
                  <label>
                    <input 
                      type="radio"
                      name="status"
                      value="Em aberto"
                      checked={statusFilter === 'Em aberto'}
                      onChange={() => setStatusFilter('Em aberto')}
                    />
                    Em aberto
                  </label>
                  
                  <label>
                    <input 
                      type="radio"
                      name="status"
                      value="Em andamento"
                      checked={statusFilter === 'Em andamento'}
                      onChange={() => setStatusFilter('Em andamento')}
                    />
                    Em andamento
                  </label>
                  
                  <label>
                    <input 
                      type="radio"
                      name="status"
                      value="Finalizado"
                      checked={statusFilter === 'Finalizado'}
                      onChange={() => setStatusFilter('Finalizado')}
                    />
                    Finalizado
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Assunto</th>
              <th scope="col">Status</th>
              <th scope="col">Cadastrado em</th>
              <th scope="col">Técnico</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className={styles.loadingContainer}>
                    <span>Buscando chamados...</span>
                  </div>
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={6}>
                  <div className={styles.emptyContainer}>
                    <span>Nenhum chamado encontrado...</span>
                    <Link to="/new">Criar novo chamado</Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredChamados.map((item, index) => {
                return (
                  <tr key={index}>
                    <td data-label="Cliente">{item.cliente}</td>
                    <td data-label="Assunto">{item.assunto}</td>
                    <td data-label="Status">
                      <span 
                        className={styles.badge} 
                        style={{ 
                          backgroundColor: 
                            item.status === 'Em aberto' ? '#5cb85c' : 
                            item.status === 'Em andamento' ? '#F6a935' : '#999'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Cadastrado">{item.createdFormat}</td>
                    <td data-label="Técnico">{item.assignedUser}</td>
                    <td data-label="#">
                      <button 
                        className={styles.action}
                        onClick={() => togglePostModal(item)}
                        style={{ backgroundColor: '#3583f6' }}
                      >
                        <FiEye color="#fff" size={17} />
                      </button>
                      
                      <button 
                        className={styles.action}
                        onClick={() => confirmDelete(item)}
                        style={{ backgroundColor: '#FF4136' }}
                      >
                        <FiTrash color="#fff" size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {showPostModal && (
          <ClientModal 
            conteudo={detail}
            buttomBack={() => setShowPostModal(false)}
            onUpdateChamado={(updatedChamado) => {
              // Não precisamos mais atualizar manualmente aqui
              togglePostModal(null);
            }}
          />
        )}
        
        <DeleteConfirmModal />
      </div>
    </div>
  );
}