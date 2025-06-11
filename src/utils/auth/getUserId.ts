// utils/auth.ts

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
	window.location.href = '/auth'; // Ajustá esta ruta si tu login está en otro lugar
};

