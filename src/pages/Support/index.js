import { addDoc, collection } from "firebase/firestore";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import styles from "./SupportPage.module.css";
import ClientHeader from "../../components/ClientHeader";

export default function SupportPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contato, setContato] = useState("");
  const [problema, setProblema] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Add resize listener for dynamic UI adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !email || !problema) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setLoading(true);
    
    try {
      const suporteData = {
        created: new Date(),
        nome,
        email,
        contato,
        problema,
        status: "Em aberto",
        userId: user.uid
      };
      
      await addDoc(collection(db, "suporte"), suporteData);
      toast.success("Solicitação de suporte enviada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.appContainer}>
      {/* ClientHeader will be visible on all screens */}
      <ClientHeader />
      
      <div className={styles.supportContainer}>
        {/* Header/Logo Area */}
        <div className={styles.supportHeader}>
          <div className="logo-container">
            <h1>{isMobile ? "ProdTech" : "ProdTech Services"}</h1>
          </div>
          
          <div className={styles.userInfo}>
            <span>CLIENTE</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={styles.supportContent}>
          <div className={styles.supportInfo}>
            <h2>Bem-vindo ao nosso Suporte!</h2>
            
            <p className={styles.supportDescription}>
              Este canal é exclusivo para resolução de problemas relacionados ao nosso sistema.
            </p>
            
            <p className={styles.supportInstructions}>
              Caso sua solicitação envolva questões técnicas ou serviços, por favor, utilize a
              opção de criação de chamados. Estamos aqui para ajudar você da melhor forma
              possível!
            </p>
          </div>
          
          <div className={styles.supportFormContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formField}>
                <label htmlFor="nome">Nome:</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className={styles.formInput}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="email">E-mail:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.formInput}
                  placeholder="seu.email@exemplo.com"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="contato">Número de contato:</label>
                <input
                  id="contato"
                  type="tel"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className={styles.formInput}
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="problema">Descrição do problema:</label>
                <textarea
                  id="problema"
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  rows={isMobile ? 4 : 5}
                  required
                  className={styles.formTextarea}
                  placeholder="Descreva detalhadamente o problema que está enfrentando..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={styles.sendButton}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer - Empty in your original code, but left for structure */}
        <div className={styles.supportFooter}>
        </div>
      </div>
    </div>
  );
}