import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { AuthContext } from '../../contexts/auth';
import styles from './style_Teste.module.css';
import logo from '../../assets/Logo/ProdTech_Branca.svg';
import userIcon from '../../assets/Logo/user.jpg';

function Login() {
  const { signIn, loadingAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTécnico, setIsTécnico] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // Detecta tamanho da tela para ajustes de responsividade
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Verifica no carregamento inicial
    checkScreenSize();
    
    // Adiciona event listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    
    // Centraliza verticalmente no carregamento
    const centerContent = () => {
      const container = document.getElementById('container');
      if (container) {
        const windowHeight = window.innerHeight;
        const containerHeight = container.offsetHeight;
        const topMargin = Math.max(50, (windowHeight - containerHeight) / 2);
        container.style.marginTop = `${topMargin}px`;
      }
    };
    
    centerContent();
    window.addEventListener('resize', centerContent);
    
    // Cleanup dos event listeners
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('resize', centerContent);
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (email !== '' && password !== '') {
      const userType = isTécnico ? 'tecnico' : 'cliente';
      await signIn(email, password, userType);
    }
  };

  const handleLogoClick = () => {
    setShowRegisterButton(true);
    setTimeout(() => setShowRegisterButton(false), 5000);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Botão Voltar para Home */}
      <Link to="/" className={styles.homeButton}>
        <FaHome className={styles.homeIcon} />
        <span className={styles.homeButtonText}>Voltar para Home</span>
      </Link>
      
      <div 
        className={`${styles.container} ${isTécnico ? styles.active : ''}`} 
        id="container"
      >
        {/* Formulário Técnico */}
        <div className={`${styles['form-container']} ${styles['sign-up']}`}>
          <form onSubmit={handleSignIn}>
            <div className={styles.logoContainer}>
              <img 
                src={logo} 
                alt="Logo ProdTech" 
                onClick={handleLogoClick} 
                className={styles.logo} 
                style={{ maxWidth: isSmallScreen ? '180px' : '250px' }}
              />
              {showRegisterButton && (
                <button className={styles['hidden-register-btn']} onClick={handleRegisterClick}>
                  Registrar-se
                </button>
              )}
            </div>
            <img src={userIcon} alt="Ícone de Usuário" className={styles['user-icon']} />
            <h1 style={{ fontSize: isSmallScreen ? '1.5rem' : '2rem' }}>Técnico</h1>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
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
            
            {/* Botão de voltar visível apenas em telas pequenas quando no modo técnico */}
            {isSmallScreen && (
              <button 
                type="button"
                onClick={() => setIsTécnico(false)}
                className={styles['hidden-register-btn']}
                style={{ marginTop: '20px' }}
              >
                Sou Cliente
              </button>
            )}
          </form>
        </div>

        {/* Formulário Cliente */}
        <div className={`${styles['form-container']} ${styles['sign-in']}`}>
          <form onSubmit={handleSignIn}>
            <img src={userIcon} alt="Ícone de Usuário" className={styles['user-icon']} />
            <h1 style={{ fontSize: isSmallScreen ? '1.5rem' : '2rem' }}>Cliente</h1>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
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
            
            {/* Botão de alternar para telas pequenas */}
            {isSmallScreen && (
              <button 
                type="button"
                onClick={() => setIsTécnico(true)}
                className={styles['hidden-register-btn']}
                style={{ marginTop: '20px' }}
              >
                Sou Técnico
              </button>
            )}
          </form>
        </div>

        {/* Alternância Cliente/Técnico - Visível apenas em telas maiores */}
        {!isSmallScreen && (
          <div className={styles['toggle-container']}>
            <div className={styles.toggle}>
              <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
                <img 
                  src={logo} 
                  alt="Logo ProdTech" 
                  onClick={handleLogoClick} 
                  className={styles.logo} 
                  style={{ maxWidth: '200px' }}
                />
                <button id="login" onClick={() => setIsTécnico(false)}>Sou Cliente</button>
                <button className={styles['secondary-btn']}>Sou Técnico</button>
              </div>
              <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
                <img 
                  src={logo} 
                  alt="Logo ProdTech" 
                  onClick={handleLogoClick} 
                  className={styles.logo}
                  style={{ maxWidth: '200px' }}
                />
                <button className={styles['secondary-btn']}>Sou Cliente</button>
                <button id="register" onClick={() => setIsTécnico(true)}>Sou Técnico</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;