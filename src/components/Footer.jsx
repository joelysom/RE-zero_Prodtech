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
          <a href="#" target="_blank" aria-label="Instagram">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="#" target="_blank" aria-label="WhatsApp">
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>
          <a href="#" target="_blank" aria-label="TikTok">
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