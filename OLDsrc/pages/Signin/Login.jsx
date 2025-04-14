import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoprotech from "../../assets/Logo/logo_branca.png";
import "./style/Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("users_cliente")) {
      const usersCliente = [
        {
          email: "cliente@example.com",
          password: "cliente123",
          type: "cliente",
        },
      ];
      localStorage.setItem("users_cliente", JSON.stringify(usersCliente));
    }

    if (!localStorage.getItem("users_tecnico")) {
      const usersTecnico = [
        {
          email: "tecnico@example.com",
          password: "tecnico123",
          type: "tecnico",
        },
      ];
      localStorage.setItem("users_tecnico", JSON.stringify(usersTecnico));
    }
  }, []);

  const handleLogin = () => {
    const usersCliente =
      JSON.parse(localStorage.getItem("users_cliente")) || [];
    const usersTecnico =
      JSON.parse(localStorage.getItem("users_tecnico")) || [];

    const usersList = isClient ? usersCliente : usersTecnico;

    const user = usersList.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      if (
        (isClient && user.type !== "cliente") ||
        (!isClient && user.type !== "tecnico")
      ) {
        alert(
          "Tipo de usuário incorreto! Verifique se você está na aba correta."
        );
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(user.type === "tecnico" ? "/chamadostech" : "/cliente");
    } else {
      alert("Email ou senha inválidos!");
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Cliente</h1>
            <span>use sua senha de e-mail</span>
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
            <div>
              <label>
                <input type="checkbox" /> Lembrar de mim?
              </label>
              <a href="#">Esqueceu sua senha?</a>
            </div>
            <button type="button" onClick={handleLogin}>
              Entrar
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form>
            <h1>Técnico</h1>
            <span>use sua senha de e-mail</span>
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
            <div>
              <label>
                <input type="checkbox" /> Lembrar de mim?
              </label>
              <a href="#">Esqueceu sua senha?</a>
            </div>
            <button type="button" onClick={handleLogin}>
              Entrar
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <img src={logoprotech} alt="Logo ProdTech" />
              <button
                id="login"
                onClick={() => {
                  setIsActive(false);
                  setIsClient(true);
                }}
              >
                Sou Cliente
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  setIsActive(true);
                  setIsClient(false);
                }}
              >
                Sou Técnico
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <img src={logoprotech} alt="Logo ProdTech" />
              <button
                className="secondary-btn"
                onClick={() => {
                  setIsActive(false);
                  setIsClient(true);
                }}
              >
                Sou Cliente
              </button>
              <button
                id="register"
                onClick={() => {
                  setIsActive(true);
                  setIsClient(false);
                }}
              >
                Sou Técnico
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
