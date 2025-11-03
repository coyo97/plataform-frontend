// src/utils/auth/permissionClient.ts
export type Perm = { module: any; action: any };

export type Role = {
  _id: string;
  name: string;
  // Acepta múltiples formas de permissions
  permissions?: Array<
    | { module?: { name?: string } | string; action?: { name?: string } | string }
    | { moduleName?: string; actionName?: string }
    | { module_name?: string; action_name?: string }
  >;
};

export type CurrentUser = {
  _id: string;
  roles?: { _id: string; name: string }[];
};

// ── helpers ───────────────────────────────────────────────────────────────────
function extractName(x: any): string | null {
  if (!x) return null;
  if (typeof x === 'string') return x.toLowerCase().trim();
  if (typeof x === 'object') {
    const candidate = x.name ?? x.nombre ?? x.label ?? x.slug ?? x.code ?? x.key ?? null;
    if (typeof candidate === 'string') return candidate.toLowerCase().trim();
  }
  return null;
}

// ── builder ───────────────────────────────────────────────────────────────────
export function buildPermissionSet(user: CurrentUser, allRoles: Role[]): Set<string> {
  const roleNames = new Set((user.roles || []).map(r => r.name?.toLowerCase().trim()));
  const perms = new Set<string>();

  for (const role of allRoles) {
    const roleName = role.name?.toLowerCase().trim();
    if (!roleName || !roleNames.has(roleName)) continue;

    for (const raw of role.permissions || []) {
      // tolerante a distintas formas
      // @ts-ignore
      const mod =
        extractName((raw as any).module) ??
        // @ts-ignore
        extractName((raw as any).moduleName) ??
        // @ts-ignore
        extractName((raw as any).module_name);

      // @ts-ignore
      const act =
        extractName((raw as any).action) ??
        // @ts-ignore
        extractName((raw as any).actionName) ??
        // @ts-ignore
        extractName((raw as any).action_name);

      if (mod && act) perms.add(`${mod}:${act}`);
    }
  }

  return perms;
}

export function can(perms: Set<string>, module: string, action: string): boolean {
  return perms.has(`${module.toLowerCase().trim()}:${action.toLowerCase().trim()}`);
}

