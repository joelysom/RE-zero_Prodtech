import { useNavigate } from "react-router-dom";
import styles from "../style/Compromise.module.css";

const Compromise = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/construcao");
  };
  
  return (
    <div className={styles.containerCompromise}>
      <div className={styles.contentWrapper}>
        <div className={styles.textCompromise}>
          <h1 className={styles.compromiseTitle}>
            Nosso Compromisso Sustentável com o Futuro
          </h1>
          <p>
            A ProdTech Services prioriza a sustentabilidade, promovendo a
            reutilização e o descarte responsável de eletrônicos. Adotamos
            práticas como economia de energia, reciclagem e incentivo à economia
            circular. Para minimizar impactos ambientais, recebemos peças de
            computadores e notebooks, garantindo seu reaproveitamento ou descarte
            seguro.
          </p>
        </div>
        <div className={styles.formSectionCompromise}>
          <h2>Solicite o descarte</h2>
          <form onSubmit={handleSubmit}>
            <input className={styles.input} type="text" placeholder="Nome" required />
            <input className={styles.input} type="email" placeholder="E-mail" required />
            <input className={styles.input} type="tel" placeholder="Telefone" required />
            <textarea
              className={styles.textarea}
              placeholder="Quais peças irão ser descartadas?"
              required
            />
            <button className={styles.buttonCompromise} type="submit">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Compromise;