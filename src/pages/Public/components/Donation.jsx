import styles from "../style/Donation.module.css";
import num1 from "../../../assets/AProdTech/icons/1.svg";
import num2 from "../../../assets/AProdTech/icons/2.svg";

const Donation = () => {
  return (
    <div className={styles.donationContainer}>
      <h2 className={styles.donationTitle}>COMO VOCÊ PODE DOAR AS PEÇAS</h2>
      <div className={styles.donationMethods}>
        <div className={styles.methodBox}>
          <h3>Através do Formulário</h3>
          <p>
            Coloque seu nome, e-mail, telefone e não esqueça de colocar quais
            peças você deseja doar.
          </p>
        </div>
        <span className={styles.or}>ou</span>
        <div className={styles.methodBox}>
          <h3>Através do E-mail</h3>
          <p>Envie um e-mail para [email@dominio.com]</p>
        </div>
        <span className={styles.or}>ou</span>
        <div className={styles.methodBox}>
          <h3>Através do Whatsapp</h3>
          <p>
            Ligue para [número de telefone] e nossa equipe estará pronta para
            ajudá-lo.
          </p>
        </div>
      </div>
      
      <h2 className={styles.donationTitle}>EXISTE 2 MANEIRAS DE VOCÊ ENTREGAR SUAS PEÇAS</h2>
      <div className={styles.deliveryOptions}>
        <div className={styles.optionBox}>
          <img className={styles.donImage} src={num1} alt="1" />
          <p>
            Após o agendamento, você pode entregar seus itens diretamente em
            nosso ponto de recebimento.
          </p>
        </div>
        <div className={styles.optionBox}>
          <img className={styles.donImage} src={num2} alt="2" />
          <p>
            Caso prefira, agende a coleta e iremos até você para buscar os
            itens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donation;