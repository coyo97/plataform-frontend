// async/routes/actionRoutes.ts
const BASE = '/actions';
export const ACTIONS      = BASE;
export const ACTION_BY_ID = (id: string) => `${BASE}/${id}`;
export default { ACTIONS, ACTION_BY_ID };

