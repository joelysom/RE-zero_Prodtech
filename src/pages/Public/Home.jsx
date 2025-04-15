import React from 'react';
import { FaInstagram, FaWhatsapp, FaTiktok, FaHeart } from 'react-icons/fa';
import { BiComment } from 'react-icons/bi';
import { FiSend, FiMoreHorizontal } from 'react-icons/fi';
import styles from './MainPage.module.css';
import { Link } from 'react-router-dom';

// Importação das imagens
import suporte from "../../assets/Home/icons/icon_suporte-tecnico.png";
import software from "../../assets/Home/icons/icon-Instalacao_e_configuracao_software.png";
import devweb from "../../assets/Home/icons/icon_desenvolvimento_web.png";
import computadores from "../../assets/Home/icons/icon_instalacao_configuracao_redes.png";
import manutencao from "../../assets/Home/icons/icon_manutenção_computadores.png";
import seguranca from "../../assets/Home/icons/icon_seguranca_redes.png";
import instagram from "../../assets/Home/image/Instagramprodtec2.jpg";

const MainPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Oferecemos soluções completas e eficientes em TI</h1>
            <p className={styles.heroDescription}>
              Nossa expertise em TI <strong>abrange todas as áreas</strong>, garantindo <strong>soluções completas e eficientes</strong> para atender às suas necessidades.
            </p>
            <Link to="/contato">
              <button className={styles.ctaButton}>
                Fale conosco!
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Conheça nossos serviços</h2>
          <p className={styles.sectionSubtitle}>Potencialize sua operação com soluções de TI sob medida</p>

          <div className={styles.servicesGrid}>
            {/* Service Card 1 */}
            <div className={styles.serviceCard}>
              <img src={suporte} alt="Suporte Técnico" className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <Link to="/construcao" className={styles.serviceButton}>
                Saiba mais
              </Link>
            </div>

            {/* Service Card 2 */}
            <div className={styles.serviceCard}>
              <img src={software} alt="Instalação e Configuração de Software" className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Instalação e Configuração de Software</h3>
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <Link to="/construcao" className={styles.serviceButton}>
                Saiba mais
              </Link>
            </div>

            {/* Service Card 3 */}
            <div className={styles.serviceCard}>
              <img src={devweb} alt="Desenvolvimento Web" className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Desenvolvimento Web</h3>
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <Link to="/construcao" className={styles.serviceButton}>
                Saiba mais
              </Link>
            </div>

            {/* Service Card 4 */}
            <div className={styles.serviceCard}>
              <img src={computadores} alt="Redes de Computadores" className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Redes de Computadores</h3>
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <Link to="/construcao" className={styles.serviceButton}>
                Saiba mais
              </Link>
            </div>

            {/* Service Card 5 */}
            <div className={styles.serviceCard}>
              <img src={manutencao} alt="Manutenção e configuração de Máquinas" className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Manutenção e configuração de Máquinas</h3>
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <Link to="/construcao" className={styles.serviceButton}>
                Saiba mais
              </Link>
            </div>

            {/* Service Card 6 */}
            <div className={styles.serviceCard}>
              <img src={seguranca} alt="Segurança de Redes" className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>Segurança de Redes</h3>
              <h3 className={styles.serviceTitle}>Suporte técnico</h3>
              <Link to="/construcao" className={styles.serviceButton}>
                Saiba mais
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Section */}
      <section className={styles.productivitySection}>
        <div className={styles.container}>
          <h2 className={styles.productivityTitle}>Produtividade sem pausas: Tecnologia que trabalha por você!</h2>
          
          <p className={styles.productivityText}>
            Nosso compromisso é <strong>eliminar falhas, reduzir chamados improdutivos e otimizar todas as operações de TI.</strong>
          </p>
          
          <p className={styles.productivityText}>
            Com suporte completo e serviços gerenciados desde a origem do problema, <strong>garantimos desempenho contínuo e produtividade máxima</strong> para sua empresa.
          </p>
        </div>
      </section>

      {/* Social Media Section */}
      <section className={styles.socialSection}>
        <div className={styles.container}>
          <div className={styles.socialWrapper}>
            <div className={styles.instagramPreview}>
              {/* Instagram Post Preview */}
              <div className={styles.instagramHeader}>
                <div className={styles.profilePic}></div>
                <span className={styles.profileName}>prodtech</span>
              </div>
              <div className={styles.postImageContainer}>
                <img src={instagram} alt="Post do Instagram ProdTech" className={styles.postImage} />
              </div>
              <div className={styles.postActions}>
                <FaHeart className={`${styles.actionIcon} ${styles.likeIcon}`} />
                <BiComment className={styles.actionIcon} />
                <FiSend className={styles.actionIcon} />
                <FiMoreHorizontal className={`${styles.actionIcon} ${styles.actionSpacer}`} />
              </div>
            </div>

            <div className={styles.socialContent}>
              <h2 className={styles.socialTitle}>Confira as últimas novidades da em nossas redes sociais!</h2>
              <p className={styles.socialDescription}>
                No Instagram da ProdTech, você encontra dicas, novidades e os melhores conteúdos sobre tecnologia!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;