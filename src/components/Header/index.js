import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi"; // Importando o ícone de logout
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
      <ul>
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
          <NavLink to="/profile" className="nav-item">
            <FiSettings className="icon" size={20} /> Perfil
          </NavLink>
        </li>
        {/* Botão de Logout abaixo */}
        <li>
          <button className="nav-item logout-btn" onClick={logOut}>
            <FiLogOut className="icon" size={20} /> Sair
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
