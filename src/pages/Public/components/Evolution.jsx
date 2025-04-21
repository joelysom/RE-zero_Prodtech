import styles from "../style/Evolution.module.css";
import logoantiga from "../../../assets/Logo/logo_antiga 1.svg";
import logonova from "../../../assets/Logo/logonova-preta.svg";

const Evolution = () => {
  return (
    <section className={styles.evolutionContainer}>
      <h2 className={styles.evolutionTitle}>
        ACOMPANHE A NOSSA <span className={styles.evolu}>EVOLUÇÃO</span>
      </h2>
      <div className={styles.evolutionCards}>
        <div className={styles.evolutionCard}>
          <img src={logoantiga} alt="Logo antiga" className={styles.evolutionLogo} />
          <h3 className={styles.evolutionYear}>2023</h3>
          <p className={styles.evolutionText}>
            Em 2023, a organização operava como <strong>Protec</strong>,
            prestando suporte tecnológico para ONGs de forma voluntária. O
            logotipo transmitia a ideia de proteção e tecnologia, alinhado ao
            propósito social da iniciativa.
          </p>
        </div>
        <div className={styles.evolutionCard}>
          <img src={logonova} alt="Logo nova" className={styles.evolutionLogo} />
          <h3 className={styles.evolutionYear}>2025</h3>
          <p className={styles.evolutionText}>
            Em 2025, a organização se transformou em uma empresa formal,
            adotando o nome{" "}
            <strong>Prodtech Services</strong>. Com essa mudança, a identidade
            visual foi modernizada para refletir inovação e profissionalismo,
            acompanhando a ampliação dos serviços oferecidos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Evolution;