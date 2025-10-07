import { titleCaseES } from '../text/titleCase';

export const normalizeTags = (arr?: string[]) => {
	if (!arr?.length) return [];
	const seen = new Set<string>();
	const out: string[] = [];
	for (const raw of arr) {
		const v = (raw ?? '').trim();
		if (!v) continue;
		const t = titleCaseES(v);
		const key = t.toLocaleLowerCase();
		if (!seen.has(key)) { seen.add(key); out.push(t); }
	}
	return out;
};

