import { get, post, put } from '../api';
import * as R from '../routes/academicHelpRoutes';
import getEnvVariables from '../../config/configEnvs';
import { AcademicHelp } from '../../types/academicHelp';
import { HelpThread } from '../../types/helpThread';

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;


type HelpQuery = {
  facultyId? : string;
  careerId?  : string;
  cycleId?   : string;
  subjectId? : string;
  requestType?: 'concept_question' | 'need_notes' | 'need_exam' | 'need_assignment';
  status?     : 'open' | 'resolved';
  author?     : string;        // solo front
};


/** GET con filtros dinámicos */
export const fetchHelpRequests = async (q: HelpQuery = {}) => {
	// Convertimos todos los filtros a query string, excepto `author` (que es solo front)
	const qs = new URLSearchParams(
		Object.entries(q).reduce((acc, [key, value]) => {
			if (key !== 'author' && value !== undefined && value !== '') {
				acc[key] = String(value);
			}
			return acc;
		}, {} as Record<string, string>)
	).toString();

	const { helps } = await get<{ helps: AcademicHelp[] }>(
		url(R.HELPS) + (qs ? `?${qs}` : '')
	);

	// Filtrado por autor (solo frontend)
	if (q.author) {
		const authorLC = q.author.toLowerCase();
		return helps.filter(h =>
							h.user?.username?.toLowerCase().includes(authorLC)
						   );
	}

	return helps;
};


export const fetchHelpById = async (id: string) => {
	const { help } = await get<{ help: AcademicHelp }>(url(R.HELP_BY_ID(id)));
	return help;
};

export const createHelpRequest = (fd: FormData) =>
	post<AcademicHelp>(url(R.HELPS), fd, true);

export const resolveHelp = (id: string) =>
	put<void>(url(R.HELP_RESOLVE(id)), {});

/* Hilo foro --------------------------------------------------------- */
export const fetchThread = (helpId: string) =>
	get<{ thread: HelpThread }>(url(R.THREAD(helpId)));

export const postMessage = async (
	helpId: string,
	payload: { content: string; file?: File }
) => {
	if (payload.file) {
		const fd = new FormData();
		fd.append('content', payload.content);
		fd.append('file', payload.file);
		return post(url(R.THREAD(helpId)), fd, true); // ← true indica multipart
	}

	return post(url(R.THREAD(helpId)), { content: payload.content });
};

export const voteMessage = (threadId: string, msgId: string) =>
	put(url(R.THREAD_VOTE(threadId, msgId)), {});

export const markSolution = (threadId: string, msgId: string) =>
	put(url(R.THREAD_SOLVE(threadId, msgId)), {});


