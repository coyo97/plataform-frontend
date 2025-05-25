// src/async/routes/streamRoutes.ts
export const STREAMS          = '/streams';
export const STREAM           = (id: string)        => `/streams/${id}`;
export const JOIN_STREAM      = (id: string)        => `/streams/${id}/join`;
export const END_STREAM       = (id: string)        => `/streams/${id}/end`;
export const LIKE_STREAM      = (id: string)        => `/streams/${id}/like`;
export const UNLIKE_STREAM    = (id: string)        => `/streams/${id}/unlike`;
export const VIEW_STREAM      = (id: string)        => `/streams/${id}/view`;
export const SHARE_SCREEN_ON  = (id: string)        => `/streams/${id}/shareScreen`;
export const SHARE_SCREEN_OFF = (id: string)        => `/streams/${id}/shareScreen`;

