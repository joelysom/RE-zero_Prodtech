import styles from "../style/Compromise.module.css";

const Compromise = () => {
  return (
    <div className={styles.containerCompromise}>
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
        <form>
          <input className={styles.input} type="text" placeholder="Nome" />
          <input className={styles.input} type="email" placeholder="E-mail" />
          <input className={styles.input} type="tel" placeholder="Telefone" />
          <textarea
            className={styles.textarea}
            placeholder="Quais peças irão ser descartadas?"
          />
          <button className={styles.buttonCompromise} type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Compromise;
