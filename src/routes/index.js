import SignIn from "../pages/SignIn";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import ClientDashboard from "../pages/ClientDashboard";
import Private from "./private";
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import CustomersList from "../pages/CostumersList";
import New from "../pages/New";
import NewClient from "../pages/NewClient";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

function RoutesApp() {
  const { userType } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      
      {/* Rota condicional para Dashboard baseada no tipo de usuário */}
      <Route
        path="/dashboard"
        element={
          <Private>
            {userType === "cliente" ? <ClientDashboard /> : <Dashboard />}
          </Private>
        }
      />
      
      {/* Rotas apenas para técnicos */}
      <Route
        path="/customers"
        element={
          <Private>
            {userType === "tecnico" ? <Customers /> : <Navigate to="/dashboard" />}
          </Private>
        }
      />
      <Route
        path="/customersList"
        element={
          <Private>
            {userType === "tecnico" ? <CustomersList /> : <Navigate to="/dashboard" />}
          </Private>
        }
      />
      
      <Route path="/profile" element={<Private><Profile /></Private>} />
      
      {/* Rota condicional para criação de chamados baseada no tipo de usuário */}
      <Route
        path="/new"
        element={
          <Private>
            {userType === "cliente" ? <NewClient /> : <New />}
          </Private>
        }
      />
      
      {/* Rota para edição de chamados (apenas para técnicos) */}
      <Route
        path="/new/:id"
        element={
          <Private>
            {userType === "tecnico" ? <New /> : <Navigate to="/dashboard" />}
          </Private>
        }
      />
    </Routes>
  );
}

export default RoutesApp;