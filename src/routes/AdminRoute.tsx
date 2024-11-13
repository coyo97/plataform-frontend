// src/routes/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
	element: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
	const userRole = localStorage.getItem('roles');

	return userRole === 'admi' ? element : <Navigate to="/" />;
};

export default AdminRoute;

