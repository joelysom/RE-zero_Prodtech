import "../style/Compromise.css";

const Compromise = () => {
  return (
    <div className="container-compromise">
      <div className="text-compromise">
        <h1 className="compromise-title">
          Nosso Compromisso Sustentável com o Futuro
        </h1>
        <p>
          A ProdTech Services prioriza a sustentabilidade, promovendo a
          reutilização e o descarte responsável de eletrônicos. Adotamos
          práticas como economia de energia, reciclagem e incentivo à economia
          circular. Para minimizar impactos ambientais, recebemos peças de
          computadores e notebooks, garantindo seu reaproveitamento ou descarte
          seguro.
        </p>
      </div>
      <div className="form-section-compromise">
        <h2>Solicite o descarte</h2>
        <form>
          <input className="input" type="text" placeholder="Nome" />
          <input className="input" type="email" placeholder="E-mail" />
          <input className="input" type="tel" placeholder="Telefone" />
          <textarea
            className="textarea"
            placeholder="Quais peças irão ser descartadas?"
          />
          <button className="button-compromise" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Compromise;
