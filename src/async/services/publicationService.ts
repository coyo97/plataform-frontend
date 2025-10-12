// src/async/services/publicationService.ts
import { get, post, put, del } from '../api';
import * as R from '../routes/publicationRoutes';
import getEnvVariables from '../../config/configEnvs';
import type { Career, Publication } from '../../types/publication';

type CacheEntry = { data: unknown; expiry: number };
const CACHE = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1_000; // 5 minutos

const read = <T>(key: string): T | null => {
	const e = CACHE.get(key);
	if (!e) return null;
	if (Date.now() > e.expiry) {
		CACHE.delete(key);
		return null;
	}
	return e.data as T;
};
const write = (key: string, data: unknown) =>
	CACHE.set(key, { data, expiry: Date.now() + TTL_MS });
const clear = () => CACHE.clear();

const { HOST, SERVICE } = getEnvVariables();
const url = (path: string) => `${HOST}${SERVICE}${path}`;

export const fetchCareers = async (): Promise<Career[]> => {
	const k = 'careers';
	const c = read<Career[]>(k);
	if (c) return c;

	const { careers } = await get<{ careers: Career[] }>(url(R.CAREERS), {});
	write(k, careers);
	return careers;
};

export const fetchPublications = async (
	path: string = R.PUBS,
	params: Record<string, unknown> = {},
): Promise<{ publications: Publication[]; pagination?: any }> => {
	const k = `${path}${JSON.stringify(params)}`;
	const c = read<{ publications: Publication[]; pagination?: any }>(k);
	if (c) return c;

	const res = await get<{ publications: Publication[]; pagination?: any }>(
		url(path),
		params,
	);
	write(k, res);
	return res;
};


export const fetchMyPublications = async (): Promise<Publication[]> => {
	const k = 'my_publications';
	const c = read<Publication[]>(k);
	if (c) return c;

	const { publications } = await get<{ publications: Publication[] }>(
		url(R.USER_PUBLICATIONS),
		{},
	);
	write(k, publications);
	return publications;
};


export const fetchPublicationById = async (id: string): Promise<Publication> => {
	const { publication } = await get<{ publication: Publication }>(
		url(R.PUB_BY_ID(id)),
		{},
	);
	return publication;
};


export const searchPublications = async (
	options: {
		query?: string;
		tag?: string;
		tags?: string[];
		careerId?: string;
		page?: number;
		limit?: number;
	} = {},
): Promise<{ publications: Publication[]; pagination?: any }> => {
	const params: Record<string, any> = {};

	if (options.query) params.query = options.query;
	if (options.tag) params.tag = options.tag;
	if (options.tags && options.tags.length) params.tags = options.tags.join(',');
	if (options.careerId) params.careerId = options.careerId;
	if (options.page) params.page = options.page;
	if (options.limit) params.limit = options.limit;

	const k = `search_${JSON.stringify(params)}`;
	const c = read<{ publications: Publication[]; pagination?: any }>(k);
	if (c) return c;

	const res = await get<{ publications: Publication[]; pagination?: any }>(
		url(R.PUB_SEARCH_BASE), // debe ser algo como `${SERVICE}/publications/search`
		params,
	);
	write(k, res);
	return res;
};

export const createPublication = async (fd: FormData): Promise<Publication> => {
	const { publication } = await post<{ publication: Publication }>(
		url(R.PUBS),
		fd,
		true,
	);
	clear();
	return publication;
};

export const updatePublication = async (id: string, fd: FormData): Promise<Publication> => {
	const { publication } = await put<{ publication: Publication }>(
		url(R.USER_PUBLICATION_BY_ID(id)), 
		fd,
		true                              
	);
	clear();
	return publication;
};

export const deletePublication = (id: string) =>
	del<void>(url(R.PUB_BY_ID(id))).finally(clear);

export const likePublication = (id: string) =>
	post<void>(url(R.PUB_LIKE(id)), {}).finally(clear);

export const unlikePublication = (id: string) =>
	post<void>(url(R.PUB_UNLIKE(id)), {}).finally(clear);

export const reportPublication = (id: string, reason: string) =>
	post<void>(url(R.PUB_REPORT(id)), { reason });

