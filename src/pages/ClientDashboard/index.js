import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiSearch, 
  FiEye, 
  FiFilter,
  FiX
} from 'react-icons/fi';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

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
      // Buscar TODOS os chamados e filtrar no cliente
      // Esta abordagem não é ideal para produção com muitos dados,
      // mas evita a necessidade de índices compostos
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
        
        // Filtrar apenas os chamados relacionados ao usuário atual
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
      
      // Ordenar por data de criação (mais recente primeiro)
      listaChamados.sort((a, b) => b.created - a.created);
      
      // Update states
      setChamados(listaChamados);
      setFilteredChamados(listaChamados);
      setIsEmpty(listaChamados.length === 0);
      
      console.log('Chamados carregados:', listaChamados.length);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
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
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(chamado => chamado.status === statusFilter);
    }
    
    // Apply search
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
      </div>
    </div>
  );
}