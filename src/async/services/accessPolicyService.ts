// src/async/services/accessPolicyService.ts
import { get, post, put, del } from '../api';
import getEnv from '../../config/configEnvs';

const { HOST, SERVICE } = getEnv();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

export type Op = 'eq' | 'neq' | 'in' | 'not_in' | 'overlaps';

export type Condition = {
	path: string;  // 'actor.careerIds' | 'actor.facultyId' | 'target.careerIds' | 'target.facultyId'
	op: Op;
	value?: any;   // string | string[]
};

export type AccessPolicy = {
	_id?: string;
	module: string | { _id: string; name: string };
	action: string | { _id: string; name: string };
	effect: 'allow' | 'deny';
	subject?: Condition[];
	target?: Condition[];
	resource?: Condition[];
	label?: string;
	enabled: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type ModuleDto = { _id: string; name: string };
export type ActionDto = { _id: string; name: string };

export async function listPolicies(): Promise<AccessPolicy[]> {
	const res = await get<{ policies: AccessPolicy[] }>(url('/access-policies'));
	return res.policies ?? [];
}

export async function createPolicy(payload: {
	moduleId: string;
	actionId: string;
	effect: 'allow' | 'deny';
	subject?: Condition[];
	target?: Condition[];
	resource?: Condition[];
	label?: string;
	enabled?: boolean;
}): Promise<AccessPolicy> {
	const res = await post<{ policy: AccessPolicy }>(url('/access-policies'), payload);
	return res.policy;
}

export async function updatePolicy(id: string, payload: Partial<{
	moduleId: string;
	actionId: string;
	effect: 'allow' | 'deny';
	subject: Condition[];
	target: Condition[];
	resource: Condition[];
	label: string;
	enabled: boolean;
}>): Promise<AccessPolicy> {
	const res = await put<{ policy: AccessPolicy }>(url(`/access-policies/${id}`), payload);
	return res.policy;
}

export async function deletePolicy(id: string): Promise<void> {
	await del(url(`/access-policies/${id}`));
}

export async function listModules(): Promise<ModuleDto[]> {
	const res = await get<{ modules: ModuleDto[] }>(url('/modules'));
	return res.modules ?? [];
}

export async function listActions(): Promise<ActionDto[]> {
	const res = await get<{ actions: ActionDto[] }>(url('/actions'));
	return res.actions ?? [];
}

