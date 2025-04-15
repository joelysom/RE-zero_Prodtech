// Header.jsx
import { useState, useEffect } from "react";
import styles from "../styles/header.module.css";
import logo from "../assets/Logo/logo_branca.png";
import { NavLink } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitorar o scroll para mudar o estilo do header quando rolar a página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fechar menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  // Impedir rolagem do body quando o menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <img src={logo} alt="ProdTech Logo" className={styles.logo} />

        {/* Menu Hamburguer */}
        <div className={styles.hamburger} onClick={toggleMenu}>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ""}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ""}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ""}`}></span>
        </div>

        {/* Navegação */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) => isActive ? styles.active : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/servicos"
                className={({ isActive }) => isActive ? styles.active : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/prodtech"
                className={({ isActive }) => isActive ? styles.active : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                A ProdTech
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contato"
                className={({ isActive }) => isActive ? styles.active : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </NavLink>
            </li>
            <li className={styles.mobileOnly}>
              <NavLink
                to="/signin"
                className={styles.btnMobile}
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Botão de login (visível apenas em desktop) */}
      <div className={styles.headerBtnContainer}>
        <NavLink to="/signin" className={styles.btn}>
          Entrar
        </NavLink>
      </div>

      {/* Overlay para quando o menu estiver aberto em dispositivos móveis */}
      {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;