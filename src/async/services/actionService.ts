import { get, post, put, del } from '../api';
import * as R from '../routes/actionRoutes';
import getEnvVariables        from '../../config/configEnvs';

export interface Action { _id: string; name: string; }

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

/* --- consultas --- */
export const fetchActions = async (): Promise<Action[]> => {
	const { actions } = await get<{ actions: Action[] }>(url(R.ACTIONS), {});
	return actions;
};

export const createAction = async (name: string): Promise<Action> => {
	const { action } = await post<{ action: Action }>(url(R.ACTIONS), { name });
	return action;
};

export const updateAction = async (id: string, name: string): Promise<Action> => {
	const { action } = await put<{ action: Action }>(url(R.ACTION_BY_ID(id)), { name });
	return action;
};

export const deleteAction = (id: string) =>
	del<void>(url(R.ACTION_BY_ID(id)));

