const BASE = '/actions';
export const ACTIONS      = BASE;            // lista + crear
export const ACTION_BY_ID = (id: string) => `${BASE}/${id}`;
export default { ACTIONS, ACTION_BY_ID };

export const ROLES        = '/roles';
export const ROLE_BY_ID   = (id: string) => `/roles/${id}`;
export const ROLE_DELETE  = (id: string) => `/roles/${id}`;

