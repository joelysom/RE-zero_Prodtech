import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiLogOut, FiPlus } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { AuthContext } from "../../contexts/auth";
import "./header.css";
import Logo from "../../assets/Logo - ProdTech 1.svg";

const ClientSidebar = () => {
  const { user, logOut } = useContext(AuthContext);

  return (
    <nav className="sidebar">
      <div className="logo">
        <img src={Logo} alt="ProTech Logo" className="logo-image" />
      </div>
      <ul className="nav-list">
        <li>
          <NavLink to="/dashboard" className="nav-item">
            <FiHome className="icon" size={20} /> Meus Chamados
          </NavLink>
        </li>
        <li>
          <NavLink to="/new" className="nav-item">
            <FiPlus className="icon" size={20} /> Novo Chamado
          </NavLink>
        </li>
        <li>
          <NavLink to="/support" className="nav-item">
            <MdOutlineSupportAgent className="icon" size={20} /> Support
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

export default ClientSidebar;