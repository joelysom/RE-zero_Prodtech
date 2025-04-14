import "../styles/header.css";
import logo from "../assets/Logo/logo_branca.png";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <img src={logo} alt="ProdTech Logo" className="logo" />
        <nav>
          <ul className="nav-links">
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
      <div className="header-btn-container">
        <NavLink to="/login" className="btn" activeClassName="active">
          Entrar
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
