import "../style/services.css";
import suporte from "../../../assets/Home/icons/icon_suporte-tecnico.png";
import software from "../../../assets/Home/icons/icon-Instalacao_e_configuracao_software.png";
import devweb from "../../../assets/Home/icons/icon_desenvolvimento_web.png";
import computadores from "../../../assets/Home/icons/icon_instalacao_configuracao_redes.png";
import manutencao from "../../../assets/Home/icons/icon_manutenção_computadores.png";
import seguranca from "../../../assets/Home/icons/icon_seguranca_redes.png";

function Services() {
  return (
    <section className="services">
      <h2>Conheça nossos serviços</h2>
      <p>Potencialize sua operação com soluções de TI sob medida</p>
      <div className="service-grid">
        <div className="service-card">
          <img src={suporte} alt="Ícone" />
          <h3>Suporte técnico</h3>
          <button className="btn-small">Saiba mais</button>
        </div>
        <div className="service-card">
          <img src={software} alt="Ícone" />
          <h3>Instalação e Configuração de Software</h3>
          <button className="btn-small">Saiba mais</button>
        </div>
        <div className="service-card">
          <img src={devweb} alt="Ícone" />
          <h3>Desenvolvimento Web</h3>
          <button className="btn-small">Saiba mais</button>
        </div>
        <div className="service-card">
          <img src={computadores} alt="Ícone" />
          <h3>Redes de Computadores</h3>
          <button className="btn-small">Saiba mais</button>
        </div>
        <div className="service-card">
          <img src={manutencao} alt="Ícone" />
          <h3>Manutenção e configuração de Maquinas</h3>
          <button className="btn-small">Saiba mais</button>
        </div>
        <div className="service-card">
          <img src={seguranca} alt="Ícone" />
          <h3>Segurança de Redes</h3>
          <button className="btn-small">Saiba mais</button>
        </div>
      </div>
    </section>
  );
}

export default Services;
