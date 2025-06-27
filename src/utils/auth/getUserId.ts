/* utils/auth.ts */

/** Devuelve el token actual (o null si no hay) */
export const getToken = (): string | null =>
	localStorage.getItem('token');

/** Devuelve el ID del usuario autenticado (o cadena vacía) */
export const getUserId = (): string =>
	localStorage.getItem('userId') ?? '';

/** Devuelve el rol del usuario (si está guardado) */
export const getUserRole = (): string =>
	localStorage.getItem('roles') ?? '';

/** Devuelve el username (si está guardado) */
export const getUsername = (): string =>
	localStorage.getItem('username') ?? '';

/** Limpia la sesión local y redirige al login */
export const logout = (): void => {
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('roles');
	localStorage.removeItem('username');
	window.location.href = '/';
};

/** Guarda la sesión local (roles opcional por si el backend no lo envía) */
export const saveSession = ({
	token,
	userId,
	roles,
	username,
}: {
	token: string;
	userId: string;
	roles?: string;
	username?: string;
}) => {
	localStorage.setItem('token', token);
	localStorage.setItem('userId', userId);
	if (roles)    localStorage.setItem('roles', roles);
	if (username) localStorage.setItem('username', username);
};

/* ---- Tipado de la respuesta de login ---- */
export interface LoginResponse {
	token: string;
	userId: string;
	roles?: string;
	username?: string;
}

