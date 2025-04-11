import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FiPlusCircle, FiArrowLeft } from "react-icons/fi"
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/ClientHeader"
import Title from "../../components/Title"
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

  const [customerSelected, setCustomerSelected] = useState(0);
  const [assunto, setAssunto] = useState('');
  const [complemento, setComplemento] = useState('');
  const [status, setStatus] = useState('');
  const [editId, setEditId] = useState(false);

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
          return;
        }

        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          nomeEmpresa: doc.data().empresaNome || 'Empresa sem nome'
        }));

        setCustomers(list);
        
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
      setStatus(data.status);

      const clienteIndex = list.findIndex(item => item.id === data.clienteId);
      setCustomerSelected(clienteIndex !== -1 ? clienteIndex : 0);
      setEditId(true);
    } catch (error) {
      console.error('Erro ao carregar chamado:', error);
      toast.error('Erro ao carregar detalhes do chamado');
      setEditId(false);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!assunto || !status || !complemento) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (customerSelected === undefined || customers.length === 0) {
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

      // Reset form
      setComplemento('');
      setCustomerSelected(0);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao processar chamado:', error);
      toast.error(`Ops, erro ao ${editId ? 'atualizar' : 'registrar'} chamado. Tente novamente.`);
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <div className="top-bar">
          <Title name={id ? 'Editando Chamado' : 'Novo Chamado'}>
            <FiPlusCircle size={25} />
          </Title>
          
          <Link to="/dashboard" className="btn-back">
            <FiArrowLeft size={24} />
            Voltar
          </Link>
        </div>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente:</label>
            {loadingCustomer ? (
              <input type='text' disabled value='Carregando clientes...' />
            ) : customers.length === 0 ? (
              <input type='text' disabled value='Nenhum cliente disponível' />
            ) : (
              <select 
                value={customerSelected} 
                onChange={(e) => setCustomerSelected(Number(e.target.value))}
                disabled={loadingCustomer}
              >
                {customers.map((item, index) => (
                  <option key={item.id} value={index}>
                    {item.nomeEmpresa}
                  </option>
                ))}
              </select>
            )}

            <label>Assunto:</label>
            <select 
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              required
            >
              <option value="">Selecione um assunto</option>
              <option value="suporte">Suporte</option>
              <option value="visita tecnica">Visita Técnica</option>
              <option value="financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              {['Em aberto', 'atendido', 'Em progresso'].map(statusOption => (
                <div key={statusOption}>
                  <input 
                    type='radio' 
                    name='status' 
                    value={statusOption}
                    checked={status === statusOption}
                    onChange={() => setStatus(statusOption)} 
                  />
                  <span>{statusOption}</span>
                </div>
              ))}
            </div>

            <label>Complemento</label>
            <textarea 
              placeholder="Descreva seu problema"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              required
            />

            <button 
              type="submit" 
              disabled={loadingSubmit || loadingCustomer}
            >
              {loadingSubmit ? 'Processando...' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}