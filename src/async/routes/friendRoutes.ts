const BASE = '/users';

export const FRIEND_REQUESTS       = `${BASE}/friend-requests`;
export const FRIEND_REQUEST_ACCEPT = (id: string) => `${BASE}/${id}/accept-friend-request`;
export const FRIEND_REQUEST_REJECT = (id: string) => `${BASE}/${id}/reject-friend-request`;

export const USERS_SEARCH            = '/users/search';
export const SEND_FRIEND_REQUEST     = (id: string) => `/users/${id}/send-friend-request`;

export const FRIENDS_LIST            = '/users/friends';
export const FRIEND_REMOVE           = (id: string) => `/users/${id}/remove-friend`;
export const USER_BLOCK              = (id: string) => `/users/${id}/block`;

export const BLOCKED_USERS_LIST = '/users/blocked-users';
export const USER_UNBLOCK      = (id: string) => `/users/${id}/unblock`;

