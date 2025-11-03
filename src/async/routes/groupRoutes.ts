const BASE = "/groups";

export const GROUPS             = BASE;                         // GET lista
export const CREATE_GROUP       = `${BASE}/create`;             // POST
export const GROUP_BY_ID        = (id: string) => `${BASE}/${id}`;
export const GROUP_MEMBERS      = (id: string) => `${BASE}/${id}/members`;
export const ADD_USER_TO_GROUP  = (id: string) => `${BASE}/${id}/addUser`;
export const REMOVE_USER_GROUP  = (id: string) => `${BASE}/${id}/removeUser`;
export const LEAVE_GROUP = (id: string) => `/groups/${id}/leave`;

export const JOIN_GROUP         = (id: string) => `${BASE}/${id}/join`;
export const DELETE_GROUP       = (id: string) => `${BASE}/${id}`;
export const GRANT_ADMIN  = (id: string) => `/groups/${id}/admins/grant`;
export const REVOKE_ADMIN = (id: string) => `/groups/${id}/admins/revoke`;

export default {
	GROUPS,
	CREATE_GROUP,
	GROUP_BY_ID,
	GROUP_MEMBERS,
	ADD_USER_TO_GROUP,
	REMOVE_USER_GROUP,
	JOIN_GROUP,
};

