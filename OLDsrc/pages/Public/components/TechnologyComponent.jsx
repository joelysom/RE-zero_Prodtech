import "../style/TechnologyComponent.css";

const TechnologyComponent = () => {
  return (
    <div className="technology-container">
      <h2>
        <strong>
          A tecnologia certa faz toda a diferença no sucesso do seu negócio!
        </strong>
      </h2>
      <p className="intro-text">
        Seja para otimizar processos, garantir segurança ou melhorar sua
        presença online, nossa equipe está pronta para oferecer as melhores
        soluções personalizadas para você.
      </p>

      <div className="cards-container">
        <div className="card">
          <h3>1</h3>
          <p>Não deixe que problemas técnicos atrapalhem seu crescimento.</p>
        </div>
        <div className="card">
          <h3>2</h3>
          <p>
            Invista em inovação e mantenha sua empresa sempre à frente no
            mercado.
          </p>
        </div>
        <div className="card">
          <h3>3</h3>
          <p>
            Conte com especialistas para cuidar da sua tecnologia com
            profissionalismo e qualidade.
          </p>
        </div>
      </div>

      <p className="contact-text">
        Entre em contato conosco e descubra como podemos transformar sua
        infraestrutura tecnológica!
      </p>

      <button className="cta-button">Solicitar orçamento agora!</button>
    </div>
  );
};

export default TechnologyComponent;
