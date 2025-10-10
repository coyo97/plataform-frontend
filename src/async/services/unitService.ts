import { get, post, put, del } from '../api';
import getEnv from '../../config/configEnvs';
const { HOST, SERVICE } = getEnv();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

type UnitPayload = {
	subjectId: string;
	title: string;
	week?: number;
};

export const listUnits = (subjectId?: string) =>
	get<{ units: any[] }>(url('/units'), subjectId ? { subjectId } : {});

export const createUnit = (payload: UnitPayload) =>
	post(url('/units'), payload);

export const updateUnit = (id: string, payload: Partial<UnitPayload>) =>
	put(url(`/units/${id}`), payload);

export const deleteUnit = (id: string) =>
	del(url(`/units/${id}`));

