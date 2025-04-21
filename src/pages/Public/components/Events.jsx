import styles from "../style/Events.module.css";

const Events = () => {
  return (
    <div className={styles.eventsContainer}>
      <div className={styles.eventSection}>
        <div className={styles.eventText}>
          <h2 className={styles.eventTitulo}>Samaritanos</h2>
          <p>
            A ONG Samaritanos teve a brilhante ideia de abrir um laboratório de
            informática para que jovens de periferia possam aprender sobre
            tecnologia. Em parceria com a ONG, trabalhamos na manutenção e
            instalação de programas nesses computadores, garantindo que estejam
            em perfeito estado para a continuidade do projeto de ensino.
          </p>
        </div>
        <div className={`${styles.eventCarousel} ${styles.samaritanos}`}></div>
      </div>

      <div className={styles.eventSection}>
        <div className={`${styles.eventCarousel} ${styles.renplay}`}></div>
        <div className={styles.eventText}>
          <h2 className={styles.eventTitulo}>Re'n'Play</h2>
          <p>
            Oferecemos uma oficina sobre manutenção de máquinas, abordando
            possíveis problemas que podem ocorrer e como resolvê-los. Também
            realizamos uma palestra de conscientização ambiental, enfatizando a
            importância do descarte consciente das peças. O evento foi marcante
            e impactante para os participantes.
          </p>
        </div>
      </div>

      <div className={styles.eventSection}>
        <div className={styles.eventText}>
          <h2 className={styles.eventTitulo}>Escolas Públicas</h2>
          <p>
            Trabalhamos com escolas públicas oferecendo suporte técnico e
            oficinas para alunos interessados em tecnologia. Nossa missão é
            garantir que todos tenham acesso ao conhecimento digital.
          </p>
        </div>
        <div className={`${styles.eventCarousel} ${styles.escolasPublicas}`}></div>
      </div>
    </div>
  );
};

export default Events;