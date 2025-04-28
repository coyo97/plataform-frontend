import { get, post, put, del } from '../api';
import * as R                   from '../routes/publicationRoutes';
import getEnvVariables          from '../../config/configEnvs';

/* util caché simple (TTL 5 min) */
type CacheEntry = { data: any; expiry: number };
const CACHE  = new Map<string, CacheEntry>();
const TTL    = 5 * 60 * 1_000;
const read   = <T>(k:string):T|null => {
	const e = CACHE.get(k); if (!e) return null;
	if (Date.now() > e.expiry){CACHE.delete(k);return null;}
	return e.data as T;
};
const write  = (k:string,d:any)=>CACHE.set(k,{data:d,expiry:Date.now()+TTL});
const clear  = () => CACHE.clear();

const { HOST, SERVICE } = getEnvVariables();
const url = (path: string) => `${HOST}${SERVICE}${path}`;

/* tipos compartidos */
export interface Career      { _id:string; name:string }
export interface Publication {
	_id:string; title:string; content:string;
	tags?:string[];                         // ← opcional
	author:{ _id:string; username:string; profile?:{profilePicture?:string}};
	filePath?:string; fileType?:string;
	likes?:string[];                        // ← opcional
	commentsCount?: number;   
}
export const fetchCareers = async () => {
	return (await get<{ careers: Career[] }>(url(R.CAREERS), {})).careers;
};


//* Feed / búsqueda / filtros 
export const fetchPublications = async (path: string, params = {}) => {
	const k = `${path}${JSON.stringify(params)}`;
	const c = read<{ publications: Publication[] }>(k);
	if (c) return c.publications;

	const d = await get<{publications:Publication[]}>(url(path), params);
	write(k,d); return d.publications;
};

export const fetchMyPublications = async () => {
	const k = 'my_publications';
	const c = read<{ publications: Publication[] }>(k);
	if (c) return c.publications;

	const d = await get<{publications:Publication[]}>(url(R.USER_PUBLICATIONS),{});
	write(k,d); return d.publications;
};

export const createPublication   = async (fd: FormData) =>
	post<Publication>(url(R.PUBS), fd, true).finally(clear);

export const updatePublication   = async (id: string, fd: FormData) =>
	put<Publication>(url(R.PUB_BY_ID(id)), fd, true).finally(clear);

export const deletePublication   = async (id: string) =>
	del<void>(url(R.PUB_BY_ID(id))).finally(clear);

export const likePublication = async (id: string) => {
	clear();                                           
	return post<void>(url(R.PUB_LIKE(id)), {});       
};

export const unlikePublication = async (id: string) => {
	clear();                                         
	return post<void>(url(R.PUB_UNLIKE(id)), {});   
};

export const reportPublication = async (id: string, reason: string): Promise<void> =>
	post<void>(url(R.PUB_REPORT(id)), { reason });

