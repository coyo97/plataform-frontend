// src/async/routes/publicationRoutes.ts
/* ───── paths relativos al recurso «publications» ───── */
const BASE = '/publications';

export const PUBS               = BASE;                // lista / crear
export const PUB_BY_ID          = (id: string) => `${BASE}/${id}`;
export const PUBS_MOST_LIKED    = `${BASE}/most-liked`;
export const PUBS_MOST_COMMENT  = `${BASE}/most-commented`;
export const PUBS_BY_CAREER     = (careerId: string) => `${BASE}/career/${careerId}`;
export const PUB_SEARCH         = (q: string) => `${BASE}/search?query=${encodeURIComponent(q)}`;
export const PUB_LIKE           = (id: string) => `${BASE}/${id}/like`;
export const PUB_UNLIKE         = (id: string) => `${BASE}/${id}/unlike`;
export const PUB_REPORT         = (id: string) => `${BASE}/${id}/report`;
export const PUB_SEARCH_BASE    = '/publications/search';

export const CAREERS            = '/careers';
export const USER_PUBLICATIONS  = '/user-publications';
export const USER_PUBLICATION_BY_ID = (id: string) => `/user-publications/${id}`;

