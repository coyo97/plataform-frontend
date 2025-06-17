const BASE = '/users';

export const ME            = `${BASE}/me`;
export const BY_ID         = (id: string) => `${BASE}/${id}`;
export const REGISTER      = `${BASE}/register`;
export const LOGIN         = `${BASE}/login`;
export const SEARCH        = (q: string) => `${BASE}/search?query=${encodeURIComponent(q)}`;

export const USERS = '/users';
export const USERS_PAGINATED = '/users';          // mismo endpoint (usa params page/limit)
export const USER_ROLES      = (id: string) => `/users/${id}/roles`;
export default { USERS };

