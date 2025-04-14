import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutesCliente from "./PrivateRoutesCliente";
import Cliente from "../pages/Client/chamadosclient";
import PrivateRoutesTecnico from "./PrivateRoutesTecnico";
import Chamados from "../pages/Tech/chamados";
import Home from "../pages/Public/Home";
import Servicos from "../pages/Public/Servicos";
import Prodtech from "../pages/Public/Prodtech";
import Contato from "../pages/Public/Contato";
import Login from "../pages/Signin/Login";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutesTecnico />}>
          <Route path="/chamadostech" element={<Chamados />} />
        </Route>
        <Route element={<PrivateRoutesCliente />}>
          <Route path="/cliente" element={<Cliente />} />
        </Route>
        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/prodtech" element={<Prodtech />} />
                <Route path="/contato" element={<Contato />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
