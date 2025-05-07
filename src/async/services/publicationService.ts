// src/async/services/publicationService.ts
import { get, post, put, del } from '../api';
import * as R                   from '../routes/publicationRoutes';
import getEnvVariables          from '../../config/configEnvs';

type CacheEntry = { data: unknown; expiry: number };
const CACHE  = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1_000;

const read = <T>(key:string):T|null => {
	const e = CACHE.get(key);
	if (!e)                 return null;
	if (Date.now()>e.expiry){CACHE.delete(key); return null;}
	return e.data as T;
};
const write = (key:string,data:unknown) =>
	CACHE.set(key,{data,expiry:Date.now()+TTL_MS});
const clear = () => CACHE.clear();

const { HOST, SERVICE } = getEnvVariables();
const url = (path:string) => `${HOST}${SERVICE}${path}`;

export interface Career { _id:string; name:string }

export interface Publication {
	_id   : string;
	title : string;
	content: string;
	tags? : string[];         // opcional ⇒ evita errores TS18048
	author: {
		_id:string; username:string;
		profile?:{ profilePicture?:string }
	};
	filePath?  : string;
	fileType?  : string;
	likes?     : string[];     // opcional ⇒ evita TS2322
	commentsCount?: number;    // para “más comentados”
}

// queries con caché 
export const fetchCareers = async ():Promise<Career[]> => {
	const k = 'careers';
	const c = read<Career[]>(k);
	if (c) return c;

	const { careers } = await get<{careers:Career[]}>(url(R.CAREERS),{});
	write(k, careers);
	return careers;
};

export const fetchPublications = async (
	path:string,               // ej. /publications?page=1
	params:Record<string,unknown> = {},
):Promise<Publication[]> => {
	const k = `${path}${JSON.stringify(params)}`;
	const c = read<Publication[]>(k);
	if (c) return c;

	const { publications } =
		await get<{publications:Publication[]}>(url(path), params);
	write(k, publications);
	return publications;
};

export const fetchMyPublications = async ():Promise<Publication[]> => {
	const k = 'my_publications';
	const c = read<Publication[]>(k);
	if (c) return c;

	const { publications } =
		await get<{publications:Publication[]}>(url(R.USER_PUBLICATIONS),{});
	write(k, publications);
	return publications;
};

export const createPublication = (fd:FormData) =>
	post<Publication>(url(R.PUBS), fd, true)
.finally(clear);

export const updatePublication = (id:string, fd:FormData) =>
	put<Publication>(url(R.PUB_BY_ID(id)), fd, true)
.finally(clear);

export const deletePublication = (id:string) =>
	del<void>(url(R.PUB_BY_ID(id)))
.finally(clear);

export const likePublication   = (id:string) =>
	post<void>(url(R.PUB_LIKE(id)), {}).finally(clear);

export const unlikePublication = (id:string) =>
	post<void>(url(R.PUB_UNLIKE(id)), {}).finally(clear);

/* reportes */
export const reportPublication = (id:string, reason:string) =>
	post<void>(url(R.PUB_REPORT(id)), { reason });

