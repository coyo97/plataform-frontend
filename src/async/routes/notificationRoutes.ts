const BASE = "/notifications";

export const NOTIFICATIONS     = BASE;                        // GET, POST
export const NOTIFICATION      = (id: string) => `${BASE}/${id}`;          // DELETE
export const MARK_AS_READ      = (id: string) => `${BASE}/${id}/read`;     // PUT

export default {
	NOTIFICATIONS,
	NOTIFICATION,
	MARK_AS_READ,
};

