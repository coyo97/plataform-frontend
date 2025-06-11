// src/async/services/userService.ts
import { get, post, put, del } from '../api';
import * as R           from '../routes/userRoutes';
import getEnvVariables  from '../../config/configEnvs';
import type { User }    from '../../types/User';
import type { LoginPayload, LoginResponse } from '../../types/auth';

const { HOST, SERVICE } = getEnvVariables();
const url = (p:string) => `${HOST}${SERVICE}${p}`;

/* --- AUTH -------------------------------------------------- */
export const login    = (payload: LoginPayload) =>
	post<LoginResponse>(url(R.LOGIN), payload);

export const register = (payload: Partial<User>) =>
	post<User>(url(R.REGISTER), payload);

	/* --- PERFIL ------------------------------------------------ */
	export const me       = () => get<{ user: User }>(url(R.ME), {}).then(r=>r.user);

	export const listUsers = () =>
		get<{ list: User[] }>(url(R.USERS), {}).then(r => r.list);

	export const getById  = (id:string) =>
		get<{ user: User }>(url(R.BY_ID(id)), {}).then(r=>r.user);

	export const update   = (id:string, payload: Partial<User>) =>
		put<User>(url(R.BY_ID(id)), payload);

	export const remove   = (id:string) =>
		del<void>(url(R.BY_ID(id)));

		/* --- UTIL -------------------------------------------------- */
		export const search   = (q:string) =>
			get<{ users: User[] }>(url(R.SEARCH(q)), {}).then(r=>r.users);

