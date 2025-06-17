const BASE = '/modules';

export const MODULES       = BASE;
export const MODULE_BY_ID  = (id: string) => `${BASE}/${id}`;

export default { MODULES, MODULE_BY_ID };

