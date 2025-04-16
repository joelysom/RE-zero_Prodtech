// Servicos.jsx
import styles from "./style/Servicos.module.css";
import ServicosComponents from "./components/ServicosComponents";
import TechnologyComponent from "./components/TechnologyComponent";

function Servicos() {
  return (
    <>
      <div className={styles.servicosContainer}>
        <div className={styles.overlay}>
          <h1 className={styles.title}>
            Conectamos Profissionais de Tecnologia a empresas que precisam de
            apoio em TI
          </h1>
          <p className={styles.subtitle}>
            Oferecemos serviços completos para sua empresa, com compromisso com
            a inovação e qualidade no atendimento.
          </p>
          <a href="/prodtech" className={styles.btn}>
            Conheça a ProdTech
          </a>
        </div>
      </div>
      <div className={styles.infoBox}>CONHEÇA NOSSOS SERVIÇOS</div>
      <ServicosComponents />
      <TechnologyComponent />
    </>
  );
}

export default Servicos;