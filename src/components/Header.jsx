import styles from "../styles/header.module.css";
import logo from "../assets/Logo/logo_branca.png";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <img src={logo} alt="ProdTech Logo" className={styles.logo} />
        <nav>
          <ul className={styles.navLinks}>
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
      <div className={styles.headerBtnContainer}>
        <NavLink 
          to="/signin" 
          className={styles.btn}
        >
          Entrar
        </NavLink>
      </div>
    </header>
  );
}

export default Header;