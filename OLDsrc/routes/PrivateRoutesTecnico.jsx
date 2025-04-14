import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutesTecnico = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return user && user.type === "tecnico" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutesTecnico;
