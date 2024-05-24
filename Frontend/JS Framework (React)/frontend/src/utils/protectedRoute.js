import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
      toast.error("El usuario no está autenticado", {toastId: 'noauth'})      
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
