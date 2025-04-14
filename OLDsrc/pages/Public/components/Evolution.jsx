import "../style/Evolution.css";
import logoantiga from "../../../assets/Logo/logo_antiga 1.svg";
import logonova from "../../../assets/Logo/logonova-preta.svg";

const Evolution = () => {
  return (
    <section className="evolution-container">
      <h2 className="evolution-title">
        ACOMPANHE A NOSSA <span className="evolu">EVOLUÇÃO</span>
      </h2>
      <div className="evolution-cards">
        <div className="evolution-card">
          <img src={logoantiga} alt="Logo antiga" className="evolution-logo" />
          <h3 className="evolution-year">2023</h3>
          <p className="evolution-text">
            Em 2023, a organização operava como <strong>Protec</strong>,
            prestando suporte tecnológico para ONGs de forma voluntária. O
            logotipo transmitia a ideia de proteção e tecnologia, alinhado ao
            propósito social da iniciativa.
          </p>
        </div>

        <div className="evolution-card">
          <img src={logonova} alt="Logo nova" className="evolution-logo" />
          <h3 className="evolution-year">2025</h3>
          <p className="evolution-text">
            Em 2025, a organização se transformou em uma empresa formal,
            adotando o nome
            <strong>Prodtech Services</strong>. Com essa mudança, a identidade
            visual foi modernizada para refletir inovação e profissionalismo,
            acompanhando a ampliação dos serviços oferecidos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Evolution;
