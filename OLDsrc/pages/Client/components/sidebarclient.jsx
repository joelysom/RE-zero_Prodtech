import { NavLink } from "react-router-dom";
import "../style/sidebarclient.css";
import Logo from "../../../assets/Logo/Logo - ProdTech 1.svg";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo">
        <img src={Logo} alt="ProTech Logo" className="logo-image" />
      </div>
      <ul>
        <li>
          <NavLink to="/chamadoscliente" className="nav-item">
            <span className="icon">ℹ</span> Chamados
          </NavLink>
        </li>
        <li>
          <NavLink to="/chamadocliente" className="nav-item">
            <span className="icon">➕</span> Criar chamados
          </NavLink>
        </li>
        <li>
          <NavLink to="/suporte" className="nav-item">
            <span className="icon">🎧</span> Suporte
          </NavLink>
        </li>
        <li>
          <NavLink to="/home" className="nav-item">
            <span className="icon">⬅️</span> Sair
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
