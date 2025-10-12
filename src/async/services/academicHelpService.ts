import { get, post, put, del } from '../api';
import * as R from '../routes/academicHelpRoutes';
import getEnvVariables from '../../config/configEnvs';
import { AcademicHelp } from '../../types/academicHelp';
import { HelpThread } from '../../types/helpThread';

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

type HelpQuery = {
	facultyId?  : string;
	careerId?   : string;
	cycleId?    : string;
	subjectId?  : string;
	requestType?: 'concept_question' | 'need_notes' | 'need_exam' | 'need_assignment';
	status?     : 'open' | 'resolved';
	/** Front-only: si pones 'me', el hook llamará a fetchMyHelpRequests() */
	owner?      : 'me' | 'all';
	/** Front-only: búsqueda por autor por nombre (legacy) */
	author?     : string;
};

/** Lista general con filtros dinámicos (NO incluye owner ni author). */
export const fetchHelpRequests = async (q: HelpQuery = {}) => {
	const qs = new URLSearchParams(
		Object.entries(q).reduce((acc, [key, value]) => {
			if (['owner', 'author'].includes(key)) return acc; // front-only
			if (value !== undefined && value !== '') acc[key] = String(value);
			return acc;
		}, {} as Record<string, string>)
	).toString();

	const { helps } = await get<{ helps: AcademicHelp[] }>(url(R.HELPS) + (qs ? `?${qs}` : ''));
	return helps;
};

/** Lista SOLO del usuario autenticado. */
export const fetchMyHelpRequests = async () => {
	const { helps } = await get<{ helps: AcademicHelp[] }>(url(R.MY_HELPS));
	return helps;
};

/** Obtener por ID */
export const fetchHelpById = async (id: string) => {
	const { help } = await get<{ help: AcademicHelp }>(url(R.HELP_BY_ID(id)));
	return help;
};

/** Crear (FormData con archivo opcional) */
export const createHelpRequest = async (fd: FormData) => {
	const { help } = await post<{ help: AcademicHelp }>(url(R.HELPS), fd, true);
	return help; // <- ahora el caller recibe AcademicHelp
};
/** Actualizar (SOLO autor) – FormData con archivo opcional */
export const updateMyHelp = async (id: string, fd: FormData) => {
	const { help } = await put<{ help: AcademicHelp }>(url(R.HELP_UPDATE(id)), fd, true);
	return help; // <- devuelve AcademicHelp directo
};
/** Eliminar (SOLO autor) */
export const deleteMyHelp = (id: string) =>
	del<{ message: string }>(url(R.HELP_DELETE(id)));

	/** Resolver (SOLO autor) */
	export const resolveHelp = (id: string) =>
		put<{ message: string; help: AcademicHelp }>(url(R.HELP_RESOLVE(id)), {});

		/* ---- Hilo foro ---- */
		export const fetchThread = (helpId: string) =>
			get<{ thread: HelpThread }>(url(R.THREAD(helpId)));

		export const postMessage = async (helpId: string, payload: { content: string; file?: File }) => {
			if (payload.file) {
				const fd = new FormData();
				fd.append('content', payload.content);
				fd.append('file', payload.file);
				return post(url(R.THREAD(helpId)), fd, true);
			}
			return post(url(R.THREAD(helpId)), { content: payload.content });
		};

		export const voteMessage = (threadId: string, msgId: string) =>
			put(url(R.THREAD_VOTE(threadId, msgId)), {});

		export const markSolution = (threadId: string, msgId: string) =>
			put(url(R.THREAD_SOLVE(threadId, msgId)), {});

