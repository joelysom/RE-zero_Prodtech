import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import './style_Teste.css';
import logo from '../../assets/Logo/ProdTech_Branca.svg';
import userIcon from '../../assets/Logo/user.jpg';

function Login() {
  const { signIn, loadingAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTécnico, setIsTécnico] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (email !== '' && password !== '') {
      await signIn(email, password);
    }
  };

  return (
    <div className={`container ${isTécnico ? 'active' : ''}`} id="container">
      {/* Formulário Técnico */}
      <div className="form-container sign-up">
        <form onSubmit={handleSignIn}>
          <img src={userIcon} alt="Ícone de Usuário" className="user-icon" />
          <h1>Técnico</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Lembrar de mim?
            </label>
            <a href="#">Esqueceu sua senha?</a>
          </div>
          <button type="submit">
            {loadingAuth ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>

      {/* Formulário Cliente */}
      <div className="form-container sign-in">
        <form>
          <img src={userIcon} alt="Ícone de Usuário" className="user-icon" />
          <h1>Cliente</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Lembrar de mim?
            </label>
            <a href="#">Esqueceu sua senha?</a>
          </div>
          <button>Entrar</button>
        </form>
      </div>

      {/* Alternância Cliente/Técnico */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <img src={logo} alt="Logo ProdTech" />
            <button id="login" onClick={() => setIsTécnico(false)}>
              Sou Cliente
            </button>
            <button className="secondary-btn">Sou Técnico</button>
          </div>
          <div className="toggle-panel toggle-right">
            <img src={logo} alt="Logo ProdTech" />
            <button className="secondary-btn">Sou Cliente</button>
            <button id="register" onClick={() => setIsTécnico(true)}>
              Sou Técnico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
