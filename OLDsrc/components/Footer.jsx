import "../styles/Footer.css";
import logo from "../assets/Logo/Logo - ProdTech 1.svg";
import instagramIcon from "../assets/img/icon_instagram.svg";
import whatsappIcon from "../assets/img/icon_whatsapp.svg";
import tiktokIcon from "../assets/img/icon_tiktok.svg";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
        <div className="social-media">
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
      <div className="footer-nav">
        <nav>
          <ul>
            <li>
              <NavLink to="/home" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/servicos" activeClassName="active">
                Serviços
              </NavLink>
            </li>
            <li>
              <NavLink to="/prodtech" activeClassName="active">
                A ProdTech
              </NavLink>
            </li>
            <li>
              <NavLink to="/contato" activeClassName="active">
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
