import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutesCliente = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return user && user.type === "cliente" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutesCliente;
