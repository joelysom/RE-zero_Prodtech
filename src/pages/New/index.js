// Restrict access to tecnico users only
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FiArrowLeft, FiChevronDown, FiPlusCircle } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/HeaderTecnico";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import './new.css';

export default function New() {
  const { user, userType } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // Cliente selecionado (índice do array customers)
  const [customerSelected, setCustomerSelected] = useState(0);
  
  // Estados para os campos do formulário
  const [assunto, setAssunto] = useState('');
  const [complemento, setComplemento] = useState('');
  const [status, setStatus] = useState('Em aberto');
  const [tipo, setTipo] = useState('Incidente');
  const [categoria, setCategoria] = useState('REDE');
  const [editId, setEditId] = useState(false);
  
  // Estados para controlar a abertura dos dropdowns
  const [statusOpen, setStatusOpen] = useState(false);
  const [tipoOpen, setTipoOpen] = useState(false);
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [clienteOpen, setClienteOpen] = useState(false);

  useEffect(() => {
    // Restrict access to tecnico users only
    if (userType !== 'tecnico') {
      toast.error('Acesso não autorizado');
      navigate('/dashboard');
      return;
    }

    async function loadingCustomers() {
      try {
        const listRef = collection(db, 'clientes');
        const snapshot = await getDocs(listRef);
        
        if (snapshot.empty) {
          toast.warning('Nenhuma empresa encontrada');
          setCustomers([]);
          setLoadingCustomer(false);
          return;
        }

        const list = snapshot.docs.map(doc => {
          // Log do documento para debug
          console.log('Cliente doc data:', doc.id, doc.data());
          return {
            id: doc.id,
            nomeEmpresa: doc.data().empresaNome || doc.data().nome || 'Empresa sem nome'
          };
        });

        console.log('Lista de clientes carregada:', list);
        
        if (list.length > 0) {
          setCustomers(list);
          setCustomerSelected(0); // Seleciona o primeiro cliente por padrão
        } else {
          setCustomers([]);
        }
        
        if (id) {
          await loadId(list);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Erro ao carregar empresas. Tente novamente.');
      } finally {
        setLoadingCustomer(false);
      }
    }

    loadingCustomers();
  }, [id, userType, navigate]);

  const loadId = async (list) => {
    try {
      const docRef = doc(db, 'chamados', id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        toast.error('Chamado não encontrado');
        return;
      }

      const data = snapshot.data();
      setAssunto(data.assunto);
      setComplemento(data.complemento);
      setStatus(data.status || 'Em aberto');
      setTipo(data.tipo || 'Incidente');
      setCategoria(data.categoria || 'REDE');

      const clienteIndex = list.findIndex(item => item.id === data.clienteId);
      setCustomerSelected(clienteIndex !== -1 ? clienteIndex : 0);
      setEditId(true);
    } catch (error) {
      console.error('Erro ao carregar chamado:', error);
      toast.error('Erro ao carregar detalhes do chamado');
      setEditId(false);
    }
  };

  // Função para selecionar uma opção de tipo
  const handleTipoSelect = (selectedType) => {
    setTipo(selectedType);
    setTipoOpen(false);
  };

  // Função para selecionar uma opção de categoria
  const handleCategoriaSelect = (selectedCategory) => {
    setCategoria(selectedCategory);
    setCategoriaOpen(false);
  };

  // Função para selecionar um status
  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setStatusOpen(false);
  };

  // Função para selecionar um cliente
  const handleClienteSelect = (index, e) => {
    if (e) {
      e.stopPropagation(); // Impede que o evento de clique propague
    }
    setCustomerSelected(index);
    setClienteOpen(false);
  };

  // Função para alternar o estado do dropdown de clientes
  const toggleClienteDropdown = (e) => {
    e.preventDefault();
    setClienteOpen(!clienteOpen);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!assunto || !complemento) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (customers.length === 0) {
      toast.error('Nenhum cliente disponível. Cadastre um cliente primeiro.');
      return;
    }

    if (customerSelected === undefined || customerSelected < 0 || customerSelected >= customers.length) {
      toast.error('Selecione um cliente válido');
      return;
    }

    setLoadingSubmit(true);

    try {
      const chamadoData = {
        created: new Date(),
        cliente: customers[customerSelected].nomeEmpresa,
        clienteId: customers[customerSelected].id,
        assunto,
        status,
        tipo,
        categoria,
        complemento,
        userId: user.uid,
        assignedUser: user.nome || 'Não atribuído'
      };

      if (editId) {
        const docRef = doc(db, 'chamados', id);
        await updateDoc(docRef, chamadoData);
        toast.info('Chamado atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'chamados'), chamadoData);
        toast.success('Chamado registrado com sucesso!');
      }

      // Reset form and navigate back
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao processar chamado:', error);
      toast.error(`Ops, erro ao ${editId ? 'atualizar' : 'registrar'} chamado. Tente novamente.`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="content">
        <div className="header-container">
          <h1>{id ? 'Editando Chamado' : 'Novo Chamado'}</h1>
        </div>
        
        <div style={{ display: "flex", width: "100%" }}>
          {/* Formulário lado esquerdo */}
          <div className="form-container">
            <form onSubmit={handleRegister} className="ticket-form">
              <div className="form-field">
                <label>Assunto*</label>
                <input
                  type="text"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  placeholder="Título do chamado"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Complemento*</label>
                <textarea
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Descreva o problema ou solicitação detalhadamente"
                  rows={6}
                  required
                ></textarea>
              </div>
            </form>
          </div>
          
          {/* Formulário lado direito */}
          <div className="right-form-container">
            <h2>Detalhes do Chamado</h2>
            
            <div className="right-form-field">
              <label>Cliente*</label>
              <div 
                className={`right-form-dropdown ${clienteOpen ? 'open' : ''}`}
                onClick={toggleClienteDropdown}
              >
                {loadingCustomer ? (
                  <span>Carregando clientes...</span>
                ) : customers.length === 0 ? (
                  <span>Nenhum cliente disponível</span>
                ) : (
                  <>
                    <span>
                      {customerSelected !== undefined && customers[customerSelected] 
                        ? customers[customerSelected].nomeEmpresa 
                        : 'Selecione um cliente'}
                    </span>
                    <FiChevronDown />
                    
                    {clienteOpen && (
                      <div className="dropdown-options">
                        {customers.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="dropdown-option" 
                            onClick={(e) => handleClienteSelect(index, e)}
                          >
                            {item.nomeEmpresa}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="right-form-field">
              <label>Tipo*</label>
              <div 
                className={`right-form-dropdown ${tipoOpen ? 'open' : ''}`}
                onClick={() => setTipoOpen(!tipoOpen)}
              >
                <span>{tipo}</span>
                <FiChevronDown />
                
                {tipoOpen && (
                  <div className="dropdown-options">
                    <div className="dropdown-option" onClick={() => handleTipoSelect("Incidente")}>
                      Incidente
                    </div>
                    <div className="dropdown-option" onClick={() => handleTipoSelect("Requisição")}>
                      Requisição
                    </div>
                    <div className="dropdown-option" onClick={() => handleTipoSelect("Dúvida")}>
                      Dúvida
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="right-form-field">
              <label>Categoria*</label>
              <div 
                className={`right-form-dropdown ${categoriaOpen ? 'open' : ''}`}
                onClick={() => setCategoriaOpen(!categoriaOpen)}
              >
                <span>{categoria}</span>
                <FiChevronDown />
                
                {categoriaOpen && (
                  <div className="dropdown-options">
                    <div className="dropdown-option" onClick={() => handleCategoriaSelect("REDE")}>
                      REDE
                    </div>
                    <div className="dropdown-option" onClick={() => handleCategoriaSelect("HARDWARE")}>
                      HARDWARE
                    </div>
                    <div className="dropdown-option" onClick={() => handleCategoriaSelect("SOFTWARE")}>
                      SOFTWARE
                    </div>
                    <div className="dropdown-option" onClick={() => handleCategoriaSelect("OUTRO")}>
                      OUTRO
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="right-form-field">
              <label>Status*</label>
              <div 
                className={`right-form-dropdown ${statusOpen ? 'open' : ''}`}
                onClick={() => setStatusOpen(!statusOpen)}
              >
                <span>{status}</span>
                <FiChevronDown />
                
                {statusOpen && (
                  <div className="dropdown-options">
                    <div className="dropdown-option" onClick={() => handleStatusSelect("Em aberto")}>
                      Em aberto
                    </div>
                    <div className="dropdown-option" onClick={() => handleStatusSelect("Em progresso")}>
                      Em progresso
                    </div>
                    <div className="dropdown-option" onClick={() => handleStatusSelect("Atendido")}>
                      Atendido
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleRegister}
              className="submit-button"
              disabled={loadingSubmit || loadingCustomer}
              style={{ marginTop: 'auto' }}
            >
              {loadingSubmit ? "Processando..." : id ? "Atualizar" : "Registrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}