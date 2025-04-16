import styles from "../styles/Footer.module.css";
import logo from "../assets/Logo/Logo - ProdTech 1.svg";
import instagramIcon from "../assets/img/icon_instagram.svg";
import whatsappIcon from "../assets/img/icon_whatsapp.svg";
import tiktokIcon from "../assets/img/icon_tiktok.svg";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" />
        </div>
        <div className={styles.socialMedia}>
          <a href="https://www.instagram.com/prodtech_services/?igsh=ODZpMmVnYm1zNHY2" target="_blank" aria-label="Instagram">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="https://wa.me/558185393577?text=Estou%20entrando%20em%20contato%20Solicitando%20informa%C3%A7%C3%B5es%20Conforme%20vi%20no%20site%20da%20ProdTech,%20Respecializada%20em%20solu%C3%A7%C3%B5es%20de%20tecnologia.%20Or%C3%A7amento%20ou%20consulta,%20Tudo%20que%20preciso%20%C3%A9%20um%20atendimento%20Agil!" target="_blank" aria-label="WhatsApp">
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>
          <a href="https://www.tiktok.com/@protec__?fbclid=PAY2xjawJsliFleHRuA2FlbQIxMAABp-ibp_xy2AInATtqBoSJPo00EeYwVCO1-WVBFQUrEvPlt0KBoHpizVIbISs-_aem_yw6T4MMoOgk9SP-yvLuCLQ" target="_blank" aria-label="TikTok">
            <img src={tiktokIcon} alt="TikTok" />
          </a>
        </div>
      </div>
      <hr />
      <div className={styles.footerNav}>
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/home" 
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/servicos" 
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                Serviços
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/prodtech" 
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                A ProdTech
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contato" 
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                Contato
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;