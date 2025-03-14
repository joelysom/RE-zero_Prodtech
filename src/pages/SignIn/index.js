import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import styles from './style_Teste.module.css'; // Importando CSS Modules
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
    <div className={`${styles.container} ${isTécnico ? styles.active : ''}`} id="container">
      {/* Formulário Técnico */}
      <div className={styles['form-container'] + ' ' + styles['sign-up']}>
        <form onSubmit={handleSignIn}>
          <img src={userIcon} alt="Ícone de Usuário" className={styles['user-icon']} />
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
          <div className={styles['remember-forgot']}>
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
      <div className={styles['form-container'] + ' ' + styles['sign-in']}>
        <form>
          <img src={userIcon} alt="Ícone de Usuário" className={styles['user-icon']} />
          <h1>Cliente</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <div className={styles['remember-forgot']}>
            <label>
              <input type="checkbox" /> Lembrar de mim?
            </label>
            <a href="#">Esqueceu sua senha?</a>
          </div>
          <button>Entrar</button>
        </form>
      </div>

      {/* Alternância Cliente/Técnico */}
      <div className={styles['toggle-container']}>
        <div className={styles.toggle}>
          <div className={styles['toggle-panel'] + ' ' + styles['toggle-left']}>
            <img src={logo} alt="Logo ProdTech" />
            <button id="login" onClick={() => setIsTécnico(false)}>
              Sou Cliente
            </button>
            <button className={styles['secondary-btn']}>Sou Técnico</button>
          </div>
          <div className={styles['toggle-panel'] + ' ' + styles['toggle-right']}>
            <img src={logo} alt="Logo ProdTech" />
            <button className={styles['secondary-btn']}>Sou Cliente</button>
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
