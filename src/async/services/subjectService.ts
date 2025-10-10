import { get, post, put, del } from '../api';
import getEnv from '../../config/configEnvs';
const { HOST, SERVICE } = getEnv();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

type SubjectPayload = {
	name: string;
	code: string;
	careerIds: string[]; // many-to-many
	level?: number;
	credits?: number;
	// opcional si más adelante lo agregan en backend:
	isFundamental?: boolean;
};

export const listSubjects = (careerId?: string) =>
	get<{ subjects: any[] }>(url('/subjects'), careerId ? { careerId } : {});

export const createSubject = (payload: SubjectPayload) =>
	post(url('/subjects'), payload);

export const updateSubject = (id: string, payload: Partial<SubjectPayload>) =>
	put(url(`/subjects/${id}`), payload);

export const deleteSubject = (id: string) =>
	del(url(`/subjects/${id}`));

