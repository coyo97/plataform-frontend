// src/async/services/profileService.ts
import { get, put, del }           from '../api';
import * as R                 from '../routes/profileRoutes';
import getEnvVariables        from '../../config/configEnvs';
import type { UserProfile }   from '../../types/profile';   

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

type CacheEntry = { data: unknown; expiry: number };
const CACHE  = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1_000;

const read  = <T>(k: string): T | null => {
	const e = CACHE.get(k);
	if (!e) return null;
	if (Date.now() > e.expiry) { CACHE.delete(k); return null; }
	return e.data as T;
};
const write = (k: string, d: unknown) =>
	CACHE.set(k, { data: d, expiry: Date.now() + TTL_MS });
const clear = () => CACHE.clear();

export const fetchMyProfile = async (): Promise<UserProfile> => {
	const k = 'my_profile';
	const c = read<UserProfile>(k);
	if (c) return c;

	const { profile } = await get<{ profile: UserProfile }>(url(R.PROFILE), {});
	write(k, profile);
	return profile;
};

export const fetchProfileById = async (id: string): Promise<UserProfile> =>
	get<UserProfile>(url(R.PROFILE_BY_ID(id)), {});

	   //Mutations (si cambian datos => clear cache)
export const updateMyProfile = (fd: FormData) =>
	put<UserProfile>(url(R.PROFILE), fd, true).finally(clear);

export const deleteMyProfilePhoto = async () =>
	del<UserProfile>(url(R.PROFILE + '/photo') );


