import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function isTokenValid(): boolean {
	const t = localStorage.getItem('token');
	if (!t) return false;
	try {
		// JWT: header.payload.signature
		const [, payload] = t.split('.');
		const { exp } = JSON.parse(atob(payload));
		// válido si exp > ahora
		return exp * 1000 > Date.now();
	} catch {
		return false;
	}
}

interface ProtectedRouteProps {
	element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
	const location = useLocation();
	const ok = isTokenValid();
	// Si no es válido, redirige a login. Evita renderizar la página con “datos vacíos”.
	return ok ? element : <Navigate to="/login" replace state={{ from: location, reason: 'expired' }} />;
};

export default ProtectedRoute;

