// async/services/permissionService.ts
import { post, get } from '../api';
import getEnvVariables from '../../config/configEnvs';
const { HOST, SERVICE } = getEnvVariables();
interface Permission {
	_id: string;
	name: string;
}

const url = (p:string) => `${HOST}${SERVICE}${p}`;
export interface PermissionPayload { moduleId:string; actionId:string; name:string; }
export const createPermission = async (payload: PermissionPayload) =>
	post<{ permission: Permission }>(url('/permissions'), payload);

export const fetchPermissions = async (): Promise<Permission[]> => {
	const { permissions } = await get<{ permissions: Permission[] }>(url('/permissions'), {});
	return permissions;
};
