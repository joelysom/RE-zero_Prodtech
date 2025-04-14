import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { VscOrganization } from 'react-icons/vsc';
import { AuthContext } from "../../contexts/auth";
import styles from "./Sidebar.module.css";
import Logo from "../../assets/Logo - ProdTech 1.svg";

const Sidebar = () => {
  const { user, logOut } = useContext(AuthContext);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={Logo} alt="ProTech Logo" className={styles.logoImage} />
      </div>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/dashboard" className={styles.navItem}>
            <FiHome className={styles.icon} size={20} /> Chamados
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={styles.navItem}>
            <FiUser className={styles.icon} size={20} /> Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/customersList" className={styles.navItem}>
            <VscOrganization className={styles.icon} size={20} /> Lista de Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={styles.navItem}>
            <FiSettings className={styles.icon} size={20} /> Perfil
          </NavLink>
        </li>
      </ul>

      <button className={styles.logoutBtn} onClick={logOut}>
        <FiLogOut className={styles.icon} size={20} /> Sair
      </button>
    </nav>
  );
};

export default Sidebar;