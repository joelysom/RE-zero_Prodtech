import styles from "../style/Sprod.module.css";

function Sprod() {
  return (
    <section className={styles.SprodSection}>
      <div className={styles.SprodContainer}>
        <h2 className={styles.SprodTitle}>Somos a ProdTech Services</h2>
        <p className={styles.SprodSubtitle}>
          <strong>
            Com uma paixão por inovação e sustentabilidade, estamos
            transformando o mercado de TI.
          </strong>
        </p>
        <p className={styles.SprodText}>
          Fundada em 2023, <strong>oferecemos soluções tecnológicas personalizadas</strong>, com foco
          na excelência e no atendimento às necessidades dos nossos clientes. Buscamos fazer a
          diferença, não apenas com soluções eficientes, mas também com práticas que respeitam o
          <strong> meio ambiente</strong> e promovem a <strong>inclusão social</strong>.
        </p>
        <p className={styles.SprodText}>
          Como uma empresa em crescimento,{" "}
          <strong>
            nossa missão é impactar positivamente a vida de nossos clientes e da comunidade
          </strong>
          , sempre com compromisso com a inovação, a responsabilidade social e a sustentabilidade.
        </p>
      </div>
    </section>
  );
}

export default Sprod;