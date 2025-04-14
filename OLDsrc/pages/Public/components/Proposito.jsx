import "../style/Proposito.css";

import icon1 from "../../../assets/AProdTech/icons/ICON 1.svg";
import icon2 from "../../../assets/AProdTech/icons/ICON 2.svg";
import icon3 from "../../../assets/AProdTech/icons/ICON 3.svg";
import icon4 from "../../../assets/AProdTech/icons/ICON 4.svg";

const Proposito = () => {
  return (
    <div className="proposito-container">
      {" "}
      <h1 className="titulo">NOSSO PROPÓSITO</h1>{" "}
      <h2 className="subtitulo">
        {" "}
        Transformar o cenário tecnológico com soluções acessíveis, sustentáveis
        e inovadoras, impactado positivamente nossos clientes e a comunidade.{" "}
      </h2>{" "}
      <p className="texto">
        {" "}
        Para alcançar esse propósito, esses pilares fundamentam nossa jornada.{" "}
      </p>{" "}
      <div className="svg-container">
        {" "}
        <div className="svg-item">
          {" "}
          <img src={icon1} alt="Ícone 1" className="svg-icon" />{" "}
          <p className="svg-paragraph">
            {" "}
            Soluções tecnológicas que simplificam processos e promovem
            eficiência.{" "}
          </p>{" "}
        </div>{" "}
        <div className="svg-item">
          {" "}
          <img src={icon2} alt="Ícone 2" className="svg-icon" />{" "}
          <p className="svg-paragraph">
            {" "}
            Práticas ecológicas que minimizam impactos ambientais.{" "}
          </p>{" "}
        </div>{" "}
        <div className="svg-item">
          {" "}
          <img src={icon3} alt="Ícone 3" className="svg-icon" />{" "}
          <p className="svg-paragraph">
            {" "}
            Compromisso com qualidade e resultados consistentes.{" "}
          </p>{" "}
        </div>{" "}
        <div className="svg-item">
          {" "}
          <img src={icon4} alt="Ícone 4" className="svg-icon" />{" "}
          <p className="svg-paragraph">
            {" "}
            Ações que geram impacto positivo na comunidade.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Proposito;
