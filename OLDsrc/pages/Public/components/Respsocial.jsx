import "../style/Respsocial.css";

import Samaritanos from "../../../assets/AProdTech/image/logo_samaritanos.png";
import RecnPlay from "../../../assets/AProdTech/image/logo_recnplay.png";
import Senac from "../../../assets/AProdTech/image/logo_senac.png";

const Respsocial = () => {
  return (
    <div className="respsocial-container">
      {" "}
      <h2 className="respsocial-title">
        Responsabilidade Social Empresarial (RSE)
      </h2>{" "}
      <p className="respsocial-text">
        {" "}
        A responsabilidade social é um dos pilares da ProdTech Services. Atuamos
        ativamente em projetos comunitários, realizando visitas a ONGs, escolas
        e eventos como o Rec’n’Play, onde promovemos palestras de capacitação
        tecnológica.{" "}
      </p>{" "}
      <p className="respsocial-text">
        {" "}
        Além disso, contribuímos para a democratização do acesso à tecnologia,
        oferecendo manutenção gratuita de máquinas e doando equipamentos para
        computadores de instituições sociais.{" "}
      </p>{" "}
      <div className="respsocial-partners">
        {" "}
        <span className="partners-title">
          Instituições e Eventos parceiros
        </span>{" "}
        <div className="partners-logos">
          {" "}
          <img src={Samaritanos} alt="Samaritanos" />{" "}
          <img src={RecnPlay} alt="Rec’n’Play" />{" "}
          <img src={Senac} alt="Senac" />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Respsocial;
