// src/ui/shared/hooks/usePermission.ts
import { useMemo } from 'react';
import { normalizeModule } from '../permissions/modules';

export function usePermission(perms: string[] | null | undefined) {
	return useMemo(() => {
		if (!perms) return { can: () => false, hasAny: () => false, canReadModule: () => false };
		const set = new Set(perms.map(p => p.toLowerCase().trim()));

		const can = (module: string, action: string) =>
			set.has(`${normalizeModule(module)}:${action}`.toLowerCase());

		const hasAny = (pairs: Array<[string, string]>) =>
			pairs.some(([m, a]) => set.has(`${normalizeModule(m)}:${a}`.toLowerCase()));

		const canReadModule = (module: string) => can(module, 'read');

		return { can, hasAny, canReadModule };
	}, [perms]);
}

