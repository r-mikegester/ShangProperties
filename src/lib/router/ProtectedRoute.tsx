import { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // Example auth check

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
