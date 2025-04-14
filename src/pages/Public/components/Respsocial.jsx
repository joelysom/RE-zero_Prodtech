import styles from "../style/Respsocial.module.css";

import Samaritanos from "../../../assets/AProdTech/image/logo_samaritanos.png";
import RecnPlay from "../../../assets/AProdTech/image/logo_recnplay.png";
import Senac from "../../../assets/AProdTech/image/logo_senac.png";

const Respsocial = () => {
  return (
    <div className={styles.respsocialContainer}>
      <h2 className={styles.respsocialTitle}>
        Responsabilidade Social Empresarial (RSE)
      </h2>
      <p className={styles.respsocialText}>
        A responsabilidade social é um dos pilares da ProdTech Services. Atuamos
        ativamente em projetos comunitários, realizando visitas a ONGs, escolas
        e eventos como o Rec’n’Play, onde promovemos palestras de capacitação
        tecnológica.
      </p>
      <p className={styles.respsocialText}>
        Além disso, contribuímos para a democratização do acesso à tecnologia,
        oferecendo manutenção gratuita de máquinas e doando equipamentos para
        computadores de instituições sociais.
      </p>
      <div className={styles.respsocialPartners}>
        <span className={styles.partnersTitle}>
          Instituições e Eventos parceiros
        </span>
        <div className={styles.partnersLogos}>
          <img src={Samaritanos} alt="Samaritanos" />
          <img src={RecnPlay} alt="Rec’n’Play" />
          <img src={Senac} alt="Senac" />
        </div>
      </div>
    </div>
  );
};

export default Respsocial;
