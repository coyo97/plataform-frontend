// async/services/roleAssignmentService.ts
import { get, put } from '../api';
import getEnv from '../../config/configEnvs';

const { HOST, SERVICE } = getEnv();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

export const getUsers = async () => {
	const res = await get<{ list: any[] }>(url('/users'), { noPagination: true });
	return res.list;
};

export const getRoles = async () => {
	const res = await get<{ roles: any[] }>(url('/roles'));
	return res.roles;
};

export const assignRoles = async (userId: string, roles: string[]) => {
	const res = await put<{ user: any }>(url(`/users/${userId}/roles`), { roles });
	return res.user;
};

