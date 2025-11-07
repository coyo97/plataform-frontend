// src/routes/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getMyPermissions } from '../async/services/permissionService';
import Loader from '../ui/shared/atoms/feedback/loader/Loader';

function isTokenValid(): boolean {
	const t = localStorage.getItem('token');
	if (!t) return false;
	try {
		const [, payload] = t.split('.');
		const { exp } = JSON.parse(atob(payload));
		return exp * 1000 > Date.now();
	} catch {
		return false;
	}
}

interface ProtectedRouteProps {
	element: React.ReactElement;
	requiredModule?: string;
	requiredAction?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	element,
	requiredModule,
	requiredAction,
}) => {
	const location = useLocation();
	const [allowed, setAllowed] = useState<boolean | null>(null); // null = cargando

	useEffect(() => {
		const checkPerms = async () => {
			const valid = isTokenValid();
			if (!valid) {
				setAllowed(false);
				return;
			}

			if (!requiredModule || !requiredAction) {
				setAllowed(true); // no requiere permiso específico
				return;
			}

			try {
				const perms = await getMyPermissions();
				const has = perms.some(
					(p) => p.toLowerCase() === `${requiredModule}:${requiredAction}`.toLowerCase()
				);
				setAllowed(has);
			} catch {
				setAllowed(false);
			}
		};

		checkPerms();
	}, [requiredModule, requiredAction]);

	if (allowed === null) {
		return <Loader message='Verificando permisos...' />;
	}

	if (!allowed) {
		return (
			<Navigate
				to="/"
				replace
				state={{
					from: location,
					reason: 'forbidden',
				}}
			/>
		);
	}

	return element;
};

export default ProtectedRoute;

