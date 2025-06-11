const BASE = '/academic-help';

export const HELPS            = BASE;              // GET lista | POST crear
export const HELP_BY_ID       = (id: string) => `${BASE}/${id}`;
export const HELP_RESOLVE     = (id: string) => `${BASE}/${id}/resolve`;

/* ---- Hilo “foro” ---- */
export const THREAD           = (helpId: string) => `${BASE}/${helpId}/thread`;
export const THREAD_VOTE      = (threadId: string, msgId: string) =>
	`/thread/${threadId}/vote/${msgId}`;
export const THREAD_SOLVE     = (threadId: string, msgId: string) =>
	`/thread/${threadId}/solve/${msgId}`;


/* NUEVOS catálogos */
export const FACULTIES = '/faculties';
export const CAREERS   = '/careers';            // ya existe
export const SUBJECTS  = '/subjects';
export const CYCLES    = '/cycles';
export const UNITS     = '/units';

