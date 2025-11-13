// src/ui/features/access-policies/utils.ts
import type { Op } from '../../../async/services/accessPolicyService';


export const parseValue = (raw: string): any => {
	const t = raw.trim();
	if (!t) return '';
	if (t.startsWith('[') || t.startsWith('{')) {
		try { return JSON.parse(t); } catch { return raw; }
	}
	if (t.includes(',')) {
		return t.split(',').map(s => s.trim()).filter(Boolean);
	}
	return t;
};


export const isSingleOp = (op: Op) => op === 'eq' || op === 'neq';


export const idToName = (id: string, list: { _id: string; name: string }[]) =>
	list.find(x => x._id === id)?.name ?? id;
