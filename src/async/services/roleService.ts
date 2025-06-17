import { get, post, put, del } from '../api';
import * as R from '../routes/roleRoutes';       // crea este archivo si aún no existe
import getEnvVariables from '../../config/configEnvs';
const { HOST, SERVICE } = getEnvVariables();
const url = (p:string) => `${HOST}${SERVICE}${p}`;
/* ------- rutas locales (mínimas) ---------- */
export const fetchActions = () => get<{ actions: Action[] }>(R.ACTIONS, {});
export const createAction = (name: string) =>
	post<{ action: Action }>(R.ACTIONS, { name });
export const updateAction = (id: string, name: string) =>
	put<{ action: Action }>(R.ACTION_BY_ID(id), { name });
export const deleteAction = (id: string) => del<void>(R.ACTION_BY_ID(id));

/* ------- tipos -------- */
export interface Action {
	_id : string;
	name: string;
}
export interface Role {
	_id: string;
	name: string;
	description?: string;
	permissions?: {
		_id: string;
		module: { name: string };
		action: { name: string };
	}[];
}


export const createRole = (data:{ name:string; description:string; permissions:string[] }) =>
  post<void>(url('/roles'), data);

export const fetchRoles = async (id: string): Promise<Role> => {
  const { role } = await get<{ role: Role }>(url(`/roles/${id}`), {});
  return role;                       // ← ahora retorna sólo el objeto
};
export const fetchRoleById = async (id: string) =>
	get<{ role: any }>(url(`/roles/${id}`), {});

export const updateRole = async (id: string, data: { name: string; description?: string; permissions: string[] }
) => put<void>(url(`/roles/${id}`), data);

export const assignRolesToUser = async (userId: string, roles: string[]) =>
	put<{ user: any }>(url(`/users/${userId}/roles`), { roles });

export const listRoles = async (): Promise<Role[]> => {
  const { roles } = await get<{ roles: Role[] }>(url(R.ROLES), {});
  return roles; 
};


export const deleteRole = async (roleId: string) =>
	del<void>(url(R.ROLE_DELETE(roleId)));
