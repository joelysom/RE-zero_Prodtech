import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { VscOrganization } from "react-icons/vsc";
import "../style/sidebar.css";
import Logo from "../../../assets/Logo/Logo - ProdTech 1.svg";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo">
        <img src={Logo} alt="ProTech Logo" className="logo-image" />
      </div>
      <ul className="nav-list">
        <li>
          <NavLink to="/dashboard" className="nav-item">
            <FiHome className="icon" size={20} /> Chamados
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className="nav-item">
            <FiUser className="icon" size={20} /> Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/customersList" className="nav-item">
            <VscOrganization className="icon" size={20} /> Lista de Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="nav-item">
            <FiSettings className="icon" size={20} /> Perfil
          </NavLink>
        </li>
      </ul>

      <NavLink to="/home" className="nav-item">
        <button className="logout-btn">
          <FiLogOut className="icon" size={20} /> Sair
        </button>
      </NavLink>
    </nav>
  );
};

export default Sidebar;
