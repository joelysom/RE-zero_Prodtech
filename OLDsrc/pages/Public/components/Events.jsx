import "../style/Events.css";

const Events = () => {
  return (
    <div className="events-container">
      {" "}
      <div className="event-section">
        {" "}
        <div className="event-text">
          {" "}
          <h2 className="event-titulo">Samaritanos</h2>{" "}
          <p>
            {" "}
            A ONG Samaritanos teve a brilhante ideia de abrir um laboratório de
            informática para que jovens de periferia possam aprender sobre
            tecnologia. Em parceria com a ONG, trabalhamos na manutenção e
            instalação de programas nesses computadores, garantindo que estejam
            em perfeito estado para a continuidade do projeto de ensino.{" "}
          </p>{" "}
        </div>{" "}
        <div className="event-carousel samaritanos"></div>{" "}
      </div>
      <div className="event-section">
        <div className="event-carousel renplay"></div>
        <div className="event-text">
          <h2 className="event-titulo">Re’n’Play</h2>
          <p>
            Oferecemos uma oficina sobre manutenção de máquinas, abordando
            possíveis problemas que podem ocorrer e como resolvê-los. Também
            realizamos uma palestra de conscientização ambiental, enfatizando a
            importância do descarte consciente das peças. O evento foi marcante
            e impactante para os participantes.
          </p>
        </div>
      </div>
      <div className="event-section">
        <div className="event-text">
          <h2 className="event-titulo">Escolas Públicas</h2>
          <p>
            Trabalhamos com escolas públicas oferecendo suporte técnico e
            oficinas para alunos interessados em tecnologia. Nossa missão é
            garantir que todos tenham acesso ao conhecimento digital.
          </p>
        </div>
        <div className="event-carousel escolas-publicas"></div>
      </div>
    </div>
  );
};

export default Events;
