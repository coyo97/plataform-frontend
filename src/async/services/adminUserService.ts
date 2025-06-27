import { get, put, del } from '../api';
import getEnvVariables   from '../../config/configEnvs';

const { HOST, SERVICE } = getEnvVariables();
const base = `${HOST}${SERVICE}`;

export interface Role   { _id: string; name: string; }
export interface Career { _id: string; name: string; }
export interface User {
	_id: string;
	username: string;
	email: string;
	careers?: Career[];
	roles?: Role[];
	status: string;
	reportCount: number;
}

export const fetchUsers = async (params: {
	page        : number;
	limit       : number;
	status?     : string;
	career?     : string;
	search?     : string;
}) =>{
	//  eliminamos pares vacíos antes de mandar al helper `get`
	const clean: Record<string, any> = {};
	Object.entries(params).forEach(([k, v]) => {
		if (v !== undefined && v !== '') clean[k] = v;
	});

	return get<{ list: User[]; totalPages: number; totalUsers: number }>(
		`${base}/users`,
		clean,
	);
};

export const fetchCareers = async () =>
	get<{ careers: Career[] }>(`${base}/careers`, {}).then(r => r.careers);

export const deactivateUser = (id: string) =>
	put<void>(`${base}/users/${id}/deactivate`, {});

export const reactivateUser = (id: string) =>
	put<void>(`${base}/users/${id}/reactivate`, {});

export const blacklistUser  = (id: string) =>
	put<void>(`${base}/users/${id}/blacklist`, {});

export const deleteUser     = (id: string) =>
	del<void>(`${base}/users/${id}`);

export const bulkAction = (ids: string[], action: 'deactivate' | 'reactivate' | 'blacklist') =>
	put<void>(
		`${base}/users/${ids}/bulk-action`,
		{ userIds: ids, action },
);

