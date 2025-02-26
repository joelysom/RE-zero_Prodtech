import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi"; // Importando o ícone de logout
import { VscOrganization } from 'react-icons/vsc';
import { AuthContext } from "../../contexts/auth";
import "./header.css";
import Logo from "../../assets/Logo - ProdTech 1.svg";

const Sidebar = () => {
  const { user, logOut } = useContext(AuthContext); // Incluindo logOut no contexto

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

      {/* Botão de Logout FORA da lista para ficar no final */}
      <button className="logout-btn" onClick={logOut}>
        <FiLogOut className="icon" size={20} /> Sair
      </button>
    </nav>
  );
};

export default Sidebar;
