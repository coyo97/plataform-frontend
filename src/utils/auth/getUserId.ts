/* utils/auth.ts */

function normalizeRoleNames(input: any): string[] {
	const lower = (s: unknown) => String(s ?? '').trim().toLowerCase();
	if (!input) return [];

	if (typeof input === 'string') {
		try {
			const parsed = JSON.parse(input);
			return normalizeRoleNames(parsed);
		} catch {
			// string simple: "admi"
			return [lower(input)];
		}
	}

	if (Array.isArray(input)) {
		return input
			.map((r) => {
				if (typeof r === 'string') return lower(r);
				if (r && typeof r === 'object') return lower((r as any).name ?? (r as any).role);
				return '';
			})
			.filter(Boolean);
	}

	if (typeof input === 'object') {
		return [lower((input as any).name ?? (input as any).role ?? '')].filter(Boolean);
	}

	return [];
}

export const getToken = (): string | null =>
	localStorage.getItem('token');

export const getUserId = (): string =>
	localStorage.getItem('userId') ?? '';

export const getUserRole = (): string =>
	localStorage.getItem('roles') ?? '';

export const getUsername = (): string =>
	localStorage.getItem('username') ?? '';

const notifyTokenChange = (token: string | null) => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(
			new CustomEvent('auth-token-changed', { detail: { token } }),
		);
	}
};

export const logout = (): void => {
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('roles');
	localStorage.removeItem('username');

	// notificar a la App que ya no hay token
	notifyTokenChange(null);

	window.location.href = '/';
};

export const saveSession = ({
	token,
	userId,
	roles,
	username,
	accountType
}: {
	token: string;
	userId: string;
	roles?: any;        
	username?: string;
	accountType?: 'guest' | 'university';
}) => {
	localStorage.setItem('token', token);
	localStorage.setItem('userId', userId);
	if (username) localStorage.setItem('username', username);

	if (roles !== undefined) {
		const roleNames = normalizeRoleNames(roles); 
		localStorage.setItem('roles', JSON.stringify(roleNames)); 
	}

	if (accountType) {
		localStorage.setItem('accountType', accountType);
	} else {
		localStorage.setItem('accountType', 'guest');
	}

	notifyTokenChange(token);
};

export const getAccountType = (): 'guest' | 'university' => {
	const value = localStorage.getItem('accountType');
	if (value === 'university' || value === 'guest') {
		return value;
	}
	return 'guest';
};

export interface LoginResponse {
	token: string;
	userId: string;
	roles?: string;
	username?: string;
	accountType?: 'guest' | 'university';
}

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

