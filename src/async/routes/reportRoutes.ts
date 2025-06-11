const BASE = "/reports";

export const REPORTS    = BASE;               // GET
export const REPORT     = (id: string) => `${BASE}/${id}`; // PUT

export default { REPORTS, REPORT };

