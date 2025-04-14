import SignIn from "../pages/SignIn";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import ClientDashboard from "../pages/ClientDashboard";
import Private from "./private";
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import CustomersList from "../pages/CostumersList";
import New from "../pages/New";
import NewClient from "../pages/NewClient";
import Support from "../pages/Support";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

// Importando as páginas públicas
import Home from "../pages/Public/Home";
import Contato from "../pages/Public/Contato";
import Prodtech from "../pages/Public/Prodtech";
import Servicos from "../pages/Public/Servicos";

// Importando componentes de layout
import Header from "../components/Header";
import Footer from "../components/Footer";

// Layout para as páginas públicas
const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

function RoutesApp() {
  const { userType } = useContext(AuthContext);

  return (
    <Routes>
      {/* Rotas de autenticação sem header/footer */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      
      {/* Rotas privadas */}
      <Route
        path="/dashboard"
        element={
          <Private>
            {userType === "cliente" ? <ClientDashboard /> : <Dashboard />}
          </Private>
        }
      />
      
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
      
      <Route
        path="/new"
        element={
          <Private>
            {userType === "cliente" ? <NewClient /> : <New />}
          </Private>
        }
      />

      <Route
        path="/support"
        element={
          <Private>
            <Support />
          </Private>
        }
      />
      
      <Route
        path="/new/:id"
        element={
          <Private>
            {userType === "tecnico" ? <New /> : <Navigate to="/dashboard" />}
          </Private>
        }
      />

      {/* Rotas públicas com Header e Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/prodtech" element={<Prodtech />} />
        <Route path="/contato" element={<Contato />} />
      </Route>
    </Routes>
  );
}

export default RoutesApp;