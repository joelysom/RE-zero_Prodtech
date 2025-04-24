import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiLogOut, FiPlus, FiMenu, FiMail } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { AuthContext } from "../../contexts/auth";
import "./header.css";
import Logo from "../../assets/Logo - ProdTech 1.svg";

const ClientSidebar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>
      
      <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={Logo} alt="ProTech Logo" className="logo-image" />
          </div>
          <button className="close-btn" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        
        <ul className="nav-list">
          <li>
            <NavLink to="/dashboard" className="nav-item" onClick={() => window.innerWidth < 768 && setIsOpen(false)}>
              <FiHome className="icon" size={20} /> <span className="nav-text">Meus Chamados</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/new" className="nav-item" onClick={() => window.innerWidth < 768 && setIsOpen(false)}>
              <FiPlus className="icon" size={20} /> <span className="nav-text">Novo Chamado</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/support" className="nav-item" onClick={() => window.innerWidth < 768 && setIsOpen(false)}>
              <MdOutlineSupportAgent className="icon" size={20} /> <span className="nav-text">Support</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/mailbox" className="nav-item" onClick={() => window.innerWidth < 768 && setIsOpen(false)}>
              <FiMail className="icon" size={20} /> <span className="nav-text">Caixa de Entrada</span>
            </NavLink>
          </li>
        </ul>

        <button className="logout-btn" onClick={logOut}>
          <FiLogOut className="icon" size={20} /> <span className="nav-text">Sair</span>
        </button>
      </nav>
      
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default ClientSidebar;