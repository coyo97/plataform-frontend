// src/routes/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { userHasAdminRole } from '../utils/auth/getUserId';

interface AdminRouteProps {
  element: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  return userHasAdminRole() ? element : <Navigate to="/" replace />;
};

export default AdminRoute;

