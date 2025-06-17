import { get, post, put, del } from '../api';
import * as R from '../routes/moduleRoutes';
import getEnvVariables        from '../../config/configEnvs';

export interface Module { _id: string; name: string; }

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

export const fetchModules = async (): Promise<Module[]> => {
	const { modules } = await get<{ modules: Module[] }>(url(R.MODULES), {});
	return modules;
};

export const createModule = async (name: string): Promise<Module> => {
	const { module } = await post<{ module: Module }>(url(R.MODULES), { name });
	return module;
};

export const updateModule = async (id: string, name: string): Promise<Module> => {
	const { module } = await put<{ module: Module }>(url(R.MODULE_BY_ID(id)), { name });
	return module;
};

export const deleteModule = async (id: string): Promise<void> =>
	del<void>(url(R.MODULE_BY_ID(id)));

