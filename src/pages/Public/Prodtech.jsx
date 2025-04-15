import React, { useState } from 'react';
import styles from './ProdTechServices.module.css';

// Icons import
import icon1 from "../../assets/AProdTech/icons/ICON 1.svg";
import icon2 from "../../assets/AProdTech/icons/ICON 2.svg";
import icon3 from "../../assets/AProdTech/icons/ICON 3.svg";
import icon4 from "../../assets/AProdTech/icons/ICON 4.svg";

// Social responsibility images
import Samaritanos from "../../assets/AProdTech/image/logo_samaritanos.png";
import RecnPlay from "../../assets/AProdTech/image/logo_recnplay.png";
import Senac from "../../assets/AProdTech/image/logo_senac.png";

// Evolution logos
import logoantiga from "../../assets/Logo/logo_antiga 1.svg";
import logonova from "../../assets/Logo/logonova-preta.svg";

export default function ProdTechServices() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form data:', formData);
  };

  return (
    <div>
      {/* Banner Section */}
      <div className={styles.prodtechbanner}>
        <div className={styles.prodtechbannerContent}>
          <h1 className={styles.prodtitle}>ProdTech Services: Inovação e Eficiência em Suporte de TI</h1>
          <p className={styles.prodsubtitle}>
            Somos uma empresa dedicada a oferecer soluções de TI avançadas, com um diferencial: unimos a competência tecnológica ao compromisso com a responsabilidade social. Buscamos sempre estar presentes para planejar a destinação responsável e sustentável dos equipamentos.
          </p>
        </div>
      </div>

      {/* Our Purpose Section */}
      <div className={styles.purposeSection}>
        <h2 className={styles.purposeTitle}>Nosso Propósito</h2>
        <p className={styles.purposeSubtitle}>
          Transformar o cenário tecnológico com soluções acessíveis, sustentáveis e inovadoras, impactando positivamente nossos clientes e a comunidade.
        </p>
        <p className={styles.purposeDescription}>Para alcançar esse objetivo, seguimos alguns princípios:</p>
        
        <div className={styles.iconGrid}>
          <div className={styles.iconItem}>
            <img src={icon1} alt="Inovação Tecnológica" className={styles.iconImage} />
            <h3 className={styles.iconTitle}>INOVAÇÃO TECNOLÓGICA PERSONALIZADA</h3>
            <p className={styles.iconDescription}>Soluções adaptadas às necessidades específicas</p>
          </div>
          <div className={styles.iconItem}>
            <img src={icon2} alt="Responsabilidade Ambiental" className={styles.iconImage} />
            <h3 className={styles.iconTitle}>RESPONSABILIDADE AMBIENTAL</h3>
            <p className={styles.iconDescription}>Destinação adequada de equipamentos eletrônicos</p>
          </div>
          <div className={styles.iconItem}>
            <img src={icon3} alt="Excelência em Serviços" className={styles.iconImage} />
            <h3 className={styles.iconTitle}>EXCELÊNCIA EM SERVIÇOS</h3>
            <p className={styles.iconDescription}>Qualidade e eficiência em cada solução</p>
          </div>
          <div className={styles.iconItem}>
            <img src={icon4} alt="Impacto Social" className={styles.iconImage} />
            <h3 className={styles.iconTitle}>IMPACTO SOCIAL POSITIVO</h3>
            <p className={styles.iconDescription}>Tecnologia como ferramenta de transformação social</p>
          </div>
        </div>
      </div>

      {/* About ProdTech Section */}
      <div className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>Somos a ProdTech Services</h2>
        <p className={styles.aboutSubtitle}>
          Uma empresa pautada pela inovação e excelência em serviços de TI, transformando o mercado de TI.
        </p>
        
        <div className={styles.aboutGrid}>
          <div>
            <h3 className={styles.aboutHeading}>Fornecemos soluções tecnológicas personalizadas</h3>
            <p className={styles.aboutText}>
              Com foco na experiência do cliente, oferecemos serviços que vão desde manutenção de computadores e redes até assessoria técnica completa. Trabalhamos com soluções eficientes, mas também com práticas que respeitam o meio ambiente e promovem a inclusão social.
            </p>
          </div>
          <div>
            <h3 className={styles.aboutHeading}>Mais do que prestar serviços</h3>
            <p className={styles.aboutText}>
              Nossa missão é impactar positivamente nossos clientes e as comunidades, sempre com compromisso com a inovação, a responsabilidade social e a sustentabilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Social Responsibility Section */}
      <div className={styles.responsibilitySection}>
        <h2 className={styles.responsibilityTitle}>Responsabilidade Social Empresarial (RSE)</h2>
        <p className={styles.responsibilityText}>
          A responsabilidade social é um dos pilares da ProdTech Services. Acreditamos que o desenvolvimento tecnológico deve ser acessível a todos os públicos, e eventos como o Rec'n'Play, onde promovemos palestras de conscientização, são essenciais para isso.
        </p>
        <p className={styles.responsibilityText}>
          Além disso, contribuímos para a democratização do acesso à tecnologia, realizando doações a instituições parceiras e levando equipamentos para computadores de instituições sociais.
        </p>

        <h3 className={styles.partnersTitle}>Instituições e Eventos Parceiros</h3>
        
        {/* Events Container */}
        <div className={styles.eventsContainer}>
          {/* Samaritanos Section */}
          <div className={styles.eventSection}>
            <div className={styles.eventText}>
              <div className={styles.eventLogo}>
                <img src={Samaritanos} alt="Samaritanos" className={styles.logoImage} />
                <h4 className={styles.eventTitulo}>Samaritanos</h4>
              </div>
              <p className={styles.eventDescription}>
                Colaboramos com essa instituição social com um laboratório de informática para que pessoas em situação possam aprender sobre tecnologia e se preparar para o mercado de trabalho. Além disso, realizamos manutenção e instalação de programas regularmente para garantir que os atendidos sempre tenham acesso a equipamentos funcionais.
              </p>
            </div>
            <div className={`${styles.eventCarousel} ${styles.samaritanos}`}></div>
          </div>
          
          {/* Rec'n'Play Section */}
          <div className={styles.eventSection}>
            <div className={`${styles.eventCarousel} ${styles.renplay}`}></div>
            <div className={styles.eventText}>
              <div className={styles.eventLogo}>
                <img src={RecnPlay} alt="Rec'n'Play" className={styles.logoImage} />
                <h4 className={styles.eventTitulo}>Rec'n'Play</h4>
              </div>
              <p className={styles.eventDescription}>
                Oferecemos uma oficina sobre reciclagem de lixo eletrônico durante o evento, promovendo conscientização sobre descarte responsável de equipamentos eletrônicos. A consciência ambiental e o impacto das práticas sustentáveis são impactantes para os participantes.
              </p>
            </div>
          </div>
          
          {/* Escolas Públicas Section */}
          <div className={styles.eventSection}>
            <div className={styles.eventText}>
              <div className={styles.eventLogo}>
                <img src={Senac} alt="Escolas Públicas" className={styles.logoImage} />
                <h4 className={styles.eventTitulo}>Escolas Públicas</h4>
              </div>
              <p className={styles.eventDescription}>
                Colaboramos com a Escola Padre Nóbrega e outras instituições públicas, levando equipamentos reformados para seus laboratórios. Além de fornecer os computadores, realizamos a instalação, configuração e manutenção periódica. Adicionalmente realizamos conscientização ambiental e promovemos ações sustentáveis e combate ao descarte irregular.
              </p>
            </div>
            <div className={`${styles.eventCarousel} ${styles.escolasPublicas}`}></div>
          </div>
        </div>
      </div>

      {/* Sustainable Commitment Section */}
      <div className={styles.commitmentSection}>
        <div className={styles.commitmentContainer}>
          <div>
            <h2 className={styles.commitmentTitle}>Nosso Compromisso Sustentável com o Futuro</h2>
            <p className={styles.commitmentText}>
              A ProdTech Services valoriza a sustentabilidade ambiental. Adotamos práticas responsáveis na destinação de equipamentos eletrônicos, evitando que componentes tóxicos contaminem o meio ambiente.
            </p>
            <p className={styles.commitmentText}>
              Através do reaproveitamento de peças, reciclagem de componentes e destinação adequada, minimizamos nosso impacto ambiental e contribuímos para um mundo mais limpo.
            </p>
          </div>
          
          <div className={styles.formContainer}>
            <h3 className={styles.formTitle}>Solicite o descarte</h3>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name" 
                placeholder="Nome" 
                value={formData.name} 
                onChange={handleChange} 
                className={styles.formInput}
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                className={styles.formInput}
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Telefone" 
                value={formData.phone} 
                onChange={handleChange} 
                className={styles.formInput}
              />
              <textarea 
                name="message" 
                placeholder="Mensagem" 
                value={formData.message} 
                onChange={handleChange} 
                className={styles.formTextarea}
              ></textarea>
              <button type="submit" className={styles.formButton}>Enviar</button>
            </form>
          </div>
        </div>
      </div>

      {/* Donation Methods Section */}
      <div className={styles.donationSection}>
        <h2 className={styles.donationTitle}>COMO VOCÊ PODE DOAR AS PEÇAS</h2>
        
        <div className={styles.donationCards}>
          <div className={styles.donationCard}>
            <h3 className={styles.donationCardTitle}>Através da Parceria</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className={styles.donationCard}>
            <h3 className={styles.donationCardTitle}>Através do E-mail</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className={styles.donationCard}>
            <h3 className={styles.donationCardTitle}>Através do WhatsApp</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>

        <h3 className={styles.deliveryTitle}>EXISTE 2 MANEIRAS DE VOCÊ ENTREGAR SUAS PEÇAS</h3>
        
        <div className={styles.deliveryOptions}>
          <div className={styles.deliveryOption}>
            <h4 className={styles.deliveryNumber}>1</h4>
            <p className={styles.deliveryText}>Após o agendamento, você pode entregar suas peças diretamente em nosso ponto físico.</p>
          </div>
          <div className={styles.deliveryOption}>
            <h4 className={styles.deliveryNumber}>2</h4>
            <p className={styles.deliveryText}>Caso prefira, agendamos a coleta e iremos até você para recolher as peças.</p>
          </div>
        </div>
      </div>

      {/* Evolution Section */}
      <div className={styles.evolutionSection}>
        <h2 className={styles.evolutionTitle}>ACOMPANHE A NOSSA EVOLUÇÃO</h2>
        
        <div className={styles.evolutionCards}>
          <div className={styles.evolutionCard}>
            <img src={logoantiga} alt="Logo antiga" className={styles.evolutionLogo} />
            <h3 className={styles.evolutionName}>PROTEC</h3>
            <h4 className={styles.evolutionYear}>2023</h4>
            <p className={styles.evolutionDescription}>
              Começamos como uma pequena empresa especializada em consertos de computadores e assistência técnica, com foco em clientes locais e pequenos negócios.
            </p>
          </div>
          
          <div className={styles.evolutionCard}>
            <img src={logonova} alt="Logo nova" className={styles.evolutionLogo} />
            <h3 className={styles.evolutionName}>ProdTech</h3>
            <h4 className={styles.evolutionYear}>2025</h4>
            <p className={styles.evolutionDescription}>
              Evoluímos para uma empresa com responsabilidade social, expandindo nossos serviços para incluir consultoria, soluções empresariais e ações sustentáveis para a comunidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}