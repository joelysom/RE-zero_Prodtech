import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import styles from "./SupportPage.module.css";
// Import your sidebar component here
import ClientHeader from "../../components/ClientHeader"; // Adjust path as needed

export default function SupportPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contato, setContato] = useState("");
  const [problema, setProblema] = useState("");
  
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
      {/* Add the sidebar component here */}
      <ClientHeader />
      
      <div className={styles.supportContainer}>
        {/* Header/Logo Area */}
        <div className={styles.supportHeader}>
          <div className="logo-container">
            <h1>ProdTech Services</h1>
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
                <label>Nome:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formField}>
                <label>E-mail:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formField}>
                <label>Número de contato:</label>
                <input
                  type="tel"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formField}>
                <label>Descrição do problema:</label>
                <textarea
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  rows={5}
                  required
                  className={styles.formTextarea}
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
        
        {/* Footer */}
        <div className={styles.supportFooter}>
        </div>
      </div>
    </div>
  );
}