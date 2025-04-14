import "../style/ServicosComponents.css";

import icon0 from "../../../assets/Servicos/icons/icon_manutenção_computadores.png";
import icon1 from "../../../assets/Servicos/icons/icon_suporte-tecnico.png";
import icon2 from "../../../assets/Servicos/icons/icon_instalacao_configuracao_redes.png";
import icon3 from "../../../assets/Servicos/icons/icon-Instalacao_e_configuracao_software.png";
import icon4 from "../../../assets/Servicos/icons/icon_seguranca_redes.png";
import icon5 from "../../../assets/Servicos/icons/icon_desenvolvimento_web.png";

const servicos = [
  {
    titulo: "Manutenção de Computadores",
    icone: icon0,
    descricao:
      "Garantimos o pleno funcionamento dos equipamentos, prevenindo falhas e prolongando sua vida útil. O processo inclui diagnóstico de hardware e software, limpeza interna, substituição de componentes defeituosos e otimização do sistema operacional, evitando problemas como superaquecimento, lentidão e falhas inesperadas, garantindo maior durabilidade e eficiência.",
  },
  {
    titulo: "Suporte Técnico",
    icone: icon1,
    descricao:
      "Oferecemos assistência rápida e eficaz para resolver problemas relacionados a computadores, redes e softwares. O atendimento pode ser feito remotamente para ajustes rápidos ou presencialmente quando necessário para reparos físicos, minimizando o tempo de inatividade e permitindo que os usuários retomem suas atividades sem interrupções.",
  },
  {
    titulo: "Redes de Computadores",
    icone: icon2,
    descricao:
      "Criamos uma infraestrutura estável e segura para garantir a conectividade eficiente de dispositivos em empresas e residências. Isso envolve a instalação de cabos, configuração de roteadores e switches, além da implementação de protocolos de segurança para proteger a transmissão de dados. Com uma rede bem estruturada, podemos melhorar a velocidade da conexão e evitar quedas e instabilidades.",
  },
  {
    titulo: "Instalação e Configuração de Software",
    icone: icon3,
    descricao:
      "Asseguramos que sistemas operacionais, aplicativos e ferramentas específicas sejam instalados corretamente, evitando incompatibilidades e falhas. O serviço inclui a ativação de licenças, personalização de configurações e atualização de softwares, garantindo desempenho otimizado e seguro para os usuários.",
  },
  {
    titulo: "Segurança de Redes",
    icone: icon4,
    descricao:
      "Implementamos soluções essenciais para proteger dados contra ameaças cibernéticas, como invasões, roubo de informações e ataques de malware. Utilizamos firewalls, criptografia, VPNs e monitoramento constante para evitar acessos não autorizados, garantindo a integridade e confidencialidade das informações, prevenindo riscos e vulnerabilidades.",
  },
  {
    titulo: "Desenvolvimento Web",
    icone: icon5,
    descricao:
      "Desenvolvemos sites modernos e funcionais para empresas, profissionais autônomos e instituições que desejam fortalecer sua presença online e atrair clientes. O processo envolve o planejamento da estrutura do site, considerando a identidade visual do cliente e os objetivos do projeto. Usamos tecnologias como HTML, CSS e JavaScript para criar páginas responsivas, otimizadas para dispositivos móveis e com boa performance, além de aplicar técnicas de SEO para melhorar a visibilidade online.",
  },
];

export default function ServicosComponents() {
  return (
    <div className="servicoscomponent-wrapper">
      <div className="servicoscomponent-grid">
        {servicos.map((servico, index) => (
          <div
            className={`servicoscomponent-card-wrapper ${
              index % 2 === 0 ? "with-line" : ""
            }`}
            key={index}
          >
            <div className="servicoscomponent-card">
              <img
                src={servico.icone}
                alt={servico.titulo}
                className="servicoscomponent-icon"
              />
              <h3>{servico.titulo}</h3>
              <p>{servico.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
