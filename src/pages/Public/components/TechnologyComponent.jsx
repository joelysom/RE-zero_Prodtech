// TechnologyComponent.jsx
import styles from "../style/TechnologyComponent.module.css";

const TechnologyComponent = () => {
  return (
    <div className={styles.technologyContainer}>
      <h2>
        A tecnologia certa faz toda a diferença no sucesso do seu negócio!
      </h2>
      <p className={styles.introText}>
        Seja para otimizar processos, garantir segurança ou melhorar sua presença
        online, nossa equipe está pronta para oferecer as melhores soluções
        personalizadas para você.
      </p>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3>1</h3>
          <p>
            Não deixe que problemas técnicos atrapalhem seu crescimento.
          </p>
        </div>
        <div className={styles.card}>
          <h3>2</h3>
          <p>
            Invista em inovação e mantenha sua empresa sempre à frente no mercado.
          </p>
        </div>
        <div className={styles.card}>
          <h3>3</h3>
          <p>
            Conte com especialistas para cuidar da sua tecnologia com profissionalismo e qualidade.
          </p>
        </div>
      </div>

      <p className={styles.contactText}>
        Entre em contato conosco e descubra como podemos transformar sua infraestrutura tecnológica!
      </p>
      <a href="https://wa.me/558194706458?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20para%20os%20serviços%20da%20ProdTech.%20Vi%20que%20vocês%20conectam%20Profissionais%20de%20Tecnologia%20a%20empresas%20e%20oferecem%20soluções%20em%20TI.%20Poderiam%20me%20passar%20mais%20detalhes%20sobre%20os%20serviços%20disponíveis?" className={styles.ctaButton}>
        Solicitar orçamento agora!
      </a>
    </div>
  );
};

export default TechnologyComponent;