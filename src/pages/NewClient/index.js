// Restrict access to Cliente users only
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClientSidebar from "../../components/ClientHeader";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import "./new-client.css";

export default function NewClient() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [telefone, setTelefone] = useState("");
  const [setor, setSetor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("Incidente");
  const [categoria, setCategoria] = useState("REDE");
  
  // Estados para controlar a abertura dos dropdowns
  const [tipoOpen, setTipoOpen] = useState(false);
  const [categoriaOpen, setcategoriaOpen] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo || !descricao) {
      toast.error("Preencha o título e a descrição");
      return;
    }
    
    setLoading(true);
    
    try {
      const chamadoData = {
        created: new Date(),
        cliente: user.empresaNome || user.nome,
        clienteId: user.uid,
        assunto: titulo,       // CORRIGIDO: mudado de "titulo" para "assunto"
        email: email || user.email,
        telefone,
        setor,
        complemento: descricao, // CORRIGIDO: mudado de "descricao" para "complemento"
        tipo,
        categoria,
        status: "Em aberto",
        userId: user.uid
      };
      
      await addDoc(collection(db, "chamados"), chamadoData);
      toast.success("Chamado registrado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao registrar chamado:", error);
      toast.error("Erro ao registrar chamado. Tente novamente.");
    } finally {
      setLoading(false);
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
    setcategoriaOpen(false);
  };
  
  return (
    <div className="dashboard-container">
      <ClientSidebar />
      
      <div className="content">
        <div className="header-container">
          <h1>Chamado</h1>
          
          <Link to="/dashboard" className="back-button">
            <FiArrowLeft size={24} />
            Voltar para o home
          </Link>
        </div>
        
        <div style={{ display: "flex", width: "100%" }}>
          {/* Formulário lado esquerdo */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="ticket-form">
              <div className="form-field">
                <label>Título*</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-field">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label>Telefone</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label>Setor</label>
                <input
                  type="text"
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label>Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={6}
                ></textarea>
              </div>
            </form>
          </div>
          
          {/* Formulário lado direito */}
          <div className="right-form-container">
            <h2>Chamado</h2>
            
            <div className="right-form-field">
              <label>Entidade</label>
              <div className="right-form-dropdown">
                <span>PRODTECH SERVICES</span>
                <FiChevronDown />
              </div>
            </div>
            
            <div className="right-form-field">
              <label>Tipo *</label>
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
                onClick={() => setcategoriaOpen(!categoriaOpen)}
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
            
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
              style={{ marginTop: 'auto' }}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}