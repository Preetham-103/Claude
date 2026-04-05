import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  const role = localStorage.getItem("role");
  return role && role.toUpperCase() === "ADMIN" ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export const UserRoute = () => {
  const role = localStorage.getItem("role");
  return role && role.toUpperCase() === "USER" ? <Outlet /> : <Navigate to="/unauthorized" />;
};
