import styles from "../style/Productivity.module.css";

function Productivity() {
  return (
    <section className={styles.prodSection}>
      <div className={styles.prodContainer}>
        <h2 className={styles.prodTitle}>
          Produtividade sem pausas: Tecnologia que trabalha por você!
        </h2>
        <p className={styles.prodText}>
          Nosso compromisso é <strong>eliminar falhas</strong>,{" "}
          <strong>reduzir chamados improdutivos</strong> e{" "}
          <strong>otimizar todas as operações de TI</strong>.
        </p>
        <p className={styles.prodText}>
          Com suporte completo e serviços gerenciados desde a origem do
          problema, <strong>garantimos desempenho contínuo</strong> e{" "}
          <strong>produtividade máxima</strong> para sua empresa.
        </p>
      </div>
    </section>
  );
}

export default Productivity;
