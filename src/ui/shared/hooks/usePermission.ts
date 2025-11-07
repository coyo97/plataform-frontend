// src/ui/shared/hooks/usePermission.ts
import { useMemo } from 'react';

export function usePermission(perms: string[] | null | undefined) {
	return useMemo(() => {
		if (!perms) return { can: () => false, hasAny: () => false };
		const set = new Set(perms.map(p => p.toLowerCase().trim()));

		const can = (module: string, action: string) =>
			set.has(`${module}:${action}`.toLowerCase());

		const hasAny = (pairs: Array<[string, string]>) =>
			pairs.some(([m, a]) => set.has(`${m}:${a}`.toLowerCase()));

		return { can, hasAny };
	}, [perms]);
}

