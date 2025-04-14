import styles from "../style/Proposito.module.css";

import icon1 from "../../../assets/AProdTech/icons/ICON 1.svg";
import icon2 from "../../../assets/AProdTech/icons/ICON 2.svg";
import icon3 from "../../../assets/AProdTech/icons/ICON 3.svg";
import icon4 from "../../../assets/AProdTech/icons/ICON 4.svg";

const Proposito = () => {
  return (
    <div className={styles.propositoContainer}>
      <h1 className={styles.titulo}>NOSSO PROPÓSITO</h1>
      <h2 className={styles.subtitulo}>
        Transformar o cenário tecnológico com soluções acessíveis, sustentáveis
        e inovadoras, impactado positivamente nossos clientes e a comunidade.
      </h2>
      <p className={styles.texto}>
        Para alcançar esse propósito, esses pilares fundamentam nossa jornada.
      </p>
      <div className={styles.svgContainer}>
        <div className={styles.svgItem}>
          <img src={icon1} alt="Ícone 1" className={styles.svgIcon} />
          <p className={styles.svgParagraph}>
            Soluções tecnológicas que simplificam processos e promovem eficiência.
          </p>
        </div>
        <div className={styles.svgItem}>
          <img src={icon2} alt="Ícone 2" className={styles.svgIcon} />
          <p className={styles.svgParagraph}>
            Práticas ecológicas que minimizam impactos ambientais.
          </p>
        </div>
        <div className={styles.svgItem}>
          <img src={icon3} alt="Ícone 3" className={styles.svgIcon} />
          <p className={styles.svgParagraph}>
            Compromisso com qualidade e resultados consistentes.
          </p>
        </div>
        <div className={styles.svgItem}>
          <img src={icon4} alt="Ícone 4" className={styles.svgIcon} />
          <p className={styles.svgParagraph}>
            Ações que geram impacto positivo na comunidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Proposito;
