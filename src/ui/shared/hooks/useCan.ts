// src/ui/shared/hooks/useCan.ts
import { useMemo } from 'react';
import { buildPermissionSet, can, Role, CurrentUser } from '../../../utils/auth/permissionClient';

type UseCanArgs = {
	user: CurrentUser | null | undefined;
	allRoles: Role[]; // lista de roles que ya ves en RolesList
};

export function useCan({ user, allRoles }: UseCanArgs) {
	return useMemo(() => {
		if (!user) return { can: () => false };
		const set = buildPermissionSet(user, allRoles);
		return {
			can: (module: string, action: string) => can(set, module, action),
			raw: set,
		};
	}, [user, allRoles]);
}

