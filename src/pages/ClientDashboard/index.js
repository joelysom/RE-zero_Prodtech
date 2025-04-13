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
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'react-toastify'; // Importando o toast

import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import ClientSidebar from '../../components/ClientHeader';
import ClientModal from '../../components/ClientModal';

import './client-dashboard.css';

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
    if(user) {
      loadChamados();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [chamados, statusFilter, searchTerm]);

  async function loadChamados() {
    setLoading(true);
    
    try {
      const chamadosRef = collection(db, 'chamados');
      const querySnapshot = await getDocs(chamadosRef);
      
      if (querySnapshot.empty) {
        setIsEmpty(true);
        setChamados([]);
        setFilteredChamados([]);
        return;
      }
      
      const listaChamados = [];
      
      querySnapshot.forEach((doc) => {
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
      setFilteredChamados(listaChamados);
      setIsEmpty(listaChamados.length === 0);
      
      console.log('Chamados carregados:', listaChamados.length);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
      toast.error("Erro ao carregar chamados!");
    } finally {
      setLoading(false);
    }
  }
  
  function togglePostModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

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

  function onUpdateChamado(updatedChamado) {
    const updatedList = chamados.map(chamado => 
      chamado.id === updatedChamado.id ? updatedChamado : chamado
    );
    
    setChamados(updatedList);
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
      
      // Atualizar a lista após deletar
      const updatedChamados = chamados.filter(item => item.id !== chamadoToDelete.id);
      setChamados(updatedChamados);
      
      // Fechar o modal de confirmação
      setShowDeleteConfirm(false);
      setChamadoToDelete(null);
      
      // Usar toast ao invés de alert
      toast.success("Chamado deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar chamado:", error);
      toast.error("Erro ao deletar chamado!");
    }
  }

  // Modal de confirmação de exclusão
  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    
    return (
      <div className="modal-container">
        <div className="modal-content">
          <h2>Confirmar exclusão</h2>
          <p>Tem certeza que deseja excluir o chamado "{chamadoToDelete?.assunto}"?</p>
          <p>Esta ação não pode ser desfeita.</p>
          
          <div className="modal-actions">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="cancel-button"
            >
              Cancelar
            </button>
            <button 
              onClick={handleDeleteChamado}
              className="delete-button"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <ClientSidebar />
      
      <div className="content">
        <div className="header-container">
          <h1>Meus Chamados</h1>
          
          <Link to="/new-client" className="new-link">
            <FiPlus size={25} />
            Novo Chamado
          </Link>
        </div>
        
        <div className="filter-container">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar chamado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FiSearch size={20} color="#FFF" />
            </button>
          </div>
          
          <button 
            className="filter-button"
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <FiFilter size={20} color="#FFF" />
            Filtrar
          </button>
          
          {showFilterModal && (
            <div className="filter-modal">
              <div className="filter-header">
                <h3>Filtros</h3>
                <button onClick={() => setShowFilterModal(false)}>
                  <FiX size={18} />
                </button>
              </div>
              
              <div className="filter-options">
                <label>Status:</label>
                <div className="radio-group">
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
        
        <table>
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
                  <div className="loading-container">
                    <span>Buscando chamados...</span>
                  </div>
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-container">
                    <span>Nenhum chamado encontrado...</span>
                    <Link to="/new-client">Criar novo chamado</Link>
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
                        className="badge" 
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
                        className="action"
                        onClick={() => togglePostModal(item)}
                        style={{ backgroundColor: '#3583f6' }}
                      >
                        <FiEye color="#fff" size={17} />
                      </button>
                      
                      <button 
                        className="action"
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
            onUpdateChamado={onUpdateChamado}
          />
        )}
        
        <DeleteConfirmModal />
      </div>
    </div>
  );
}