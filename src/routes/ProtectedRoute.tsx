import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si existe un token en localStorage

  return isAuthenticated ? element : <Navigate to="/login" />; // Redirige a /login si no está autenticado
};

export default ProtectedRoute;

