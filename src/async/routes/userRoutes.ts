const BASE = '/users';

export const ME            = `${BASE}/me`;
export const BY_ID         = (id: string) => `${BASE}/${id}`;
export const REGISTER      = `${BASE}/register`;
export const LOGIN         = `${BASE}/login`;
export const SEARCH        = (q: string) => `${BASE}/search?query=${encodeURIComponent(q)}`;

