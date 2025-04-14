import "./style/Servicos.css";
import ServicosComponents from "./components/ServicosComponents";
import TechnologyComponent from "./components/TechnologyComponent";

function Servicos() {
  return (
    <>
      <div className="servicos-container">
        <div className="overlay">
          <h1 className="title">
            Conectamos Profissionais de Tecnologia a empresas que precisam de
            apoio em TI
          </h1>
          <p className="subtitle">
            Oferecemos serviços completos para sua empresa, com compromisso com
            a inovação e qualidade no atendimento.
          </p>
          <a href="#" className="btn">
            Conheça a ProdTech
          </a>
        </div>
        <div className="info-box">CONHEÇA NOSSOS SERVIÇOS</div>
      </div>
      <ServicosComponents />
      <TechnologyComponent />
    </>
  );
}

export default Servicos;
