/* utils/auth.ts */

/** Devuelve el token actual (o null si no hay) */
function normalizeRoleNames(input: any): string[] {
	const lower = (s: unknown) => String(s ?? '').trim().toLowerCase();
	if (!input) return [];

	// Si ya viene como string JSON: '["admi","user"]'
	if (typeof input === 'string') {
		try {
			const parsed = JSON.parse(input);
			return normalizeRoleNames(parsed);
		} catch {
			// string simple: "admi"
			return [lower(input)];
		}
	}

	// Array mixto: ["admi", {name:"user"}, {role:"moderator"}]
	if (Array.isArray(input)) {
		return input
		.map((r) => {
			if (typeof r === 'string') return lower(r);
			if (r && typeof r === 'object') return lower((r as any).name ?? (r as any).role);
			return '';
		})
		.filter(Boolean);
	}

	// Objeto único: {name:"admi"} o {role:"admi"}
	if (typeof input === 'object') {
		return [lower((input as any).name ?? (input as any).role ?? '')].filter(Boolean);
	}

	return [];
}

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
	roles?: any;        // <- ahora aceptamos cualquier forma
	username?: string;
}) => {
	localStorage.setItem('token', token);
	localStorage.setItem('userId', userId);
	if (username) localStorage.setItem('username', username);

	if (roles !== undefined) {
		const roleNames = normalizeRoleNames(roles); // <- normaliza
		localStorage.setItem('roles', JSON.stringify(roleNames)); // <- guarda SIEMPRE JSON
	}
};


/* ---- Tipado de la respuesta de login ---- */
export interface LoginResponse {
	token: string;
	userId: string;
	roles?: string;
	username?: string;
}

/** Devuelve true si el usuario actual tiene rol admin/admi */
export function userHasAdminRole(): boolean {
	const raw = localStorage.getItem('roles');
	if (!raw) return false;
	try {
		const arr = JSON.parse(raw);
		if (Array.isArray(arr)) {
			return arr.includes('admi') || arr.includes('admin');
		}
	} catch {}
	return false;
}
