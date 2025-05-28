// src/async/routes/profileRoutes.ts
const BASE = '/profile';

export const PROFILE        = BASE;          // GET + PUT (own profile)
export const PROFILE_BY_ID  = (id: string) => `${BASE}/${id}`; // p.ej. GET público

export default { PROFILE, PROFILE_BY_ID };

