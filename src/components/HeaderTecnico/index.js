import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { VscOrganization } from 'react-icons/vsc';
import { AuthContext } from "../../contexts/auth";
import styles from "./Sidebar.module.css";
import Logo from "../../assets/Logo - ProdTech 1.svg";

const Sidebar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className={styles.menuToggle} onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>
      
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src={Logo} alt="ProTech Logo" className={styles.logoImage} />
          </div>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        
        <ul className={styles.navList}>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)}
            >
              <FiHome className={styles.icon} size={20} /> 
              <span className={styles.navText}>Chamados</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customers" 
              className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)}
            >
              <FiUser className={styles.icon} size={20} /> 
              <span className={styles.navText}>Cadastrar Cliente</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customersList" 
              className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)}
            >
              <VscOrganization className={styles.icon} size={20} /> 
              <span className={styles.navText}>Lista de Clientes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)}
            >
              <FiSettings className={styles.icon} size={20} /> 
              <span className={styles.navText}>Perfil</span>
            </NavLink>
          </li>
        </ul>

        <button className={styles.logoutBtn} onClick={logOut}>
          <FiLogOut className={styles.icon} size={20} /> 
          <span className={styles.navText}>Sair</span>
        </button>
      </nav>
      
      {isOpen && <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;