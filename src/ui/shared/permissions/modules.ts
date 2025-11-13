// src/ui/shared/permissions/modules.ts

export type PermKey = `${string}:${'read'|'create'|'update'|'delete'}`;

const stripDiacritics = (s: string) =>
	(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	export const toSingular = (s: string) =>
		s?.toLowerCase().endsWith('s') ? s.slice(0, -1) : s;

	export const normalizeModule = (name: string) => {
		const raw = (name || '').trim().toLowerCase();
		const base = raw.split('?')[0].split('#')[0];
		const seg = base.startsWith('/') ? base.slice(1) : base;
		const first = (seg.split('/')[0] || seg).trim();

		const clean = stripDiacritics(first).replace(/[\s_]+/g, '-');

		const ALIASES: Record<string, string> = {
			// STREAM
			'stream': 'stream',
			'streams': 'stream',
			'streaming': 'stream',
			'stream-academi': 'stream',      
			'stream-academico': 'stream',
			'stream-academico-live': 'stream',

			'message': 'message',
			'messages': 'message',
			'chat': 'message',
			'mensajeria': 'message',
			'mensajes': 'message',

			'publication': 'publication',
			'publications': 'publication',
			'publicacion': 'publication',
			'publicaciones': 'publication',

			'profile': 'profile',
			'perfil': 'profile',
			'estudiante': 'profile',

			'help-academic': 'help-academic',
			'academic-help': 'help-academic',
			'ayuda-academica': 'help-academic',
			'ayuda-academico': 'help-academic',
			'acadmic-help': 'help-academic',  

			'admin': 'admin',
			'administrator': 'administrator',
		};

		if (ALIASES[clean]) return ALIASES[clean];

		const singular = toSingular(clean);
		if (ALIASES[singular]) return ALIASES[singular];

		// Fallback: devolver lo que quedó
		return singular;
	};

export function getModuleFromNav(to?: string, label?: string): string | null {
	// Prioridad: path .to
	if (to) {
		try {
			const seg = to
			.toLowerCase()
			.split('?')[0]
			.split('#')[0]
			.split('/')
			.filter(Boolean)[0];
			if (seg) return normalizeModule(seg);
		} catch {}
	}

	if (label) {
		const l = stripDiacritics(label.toLowerCase());
		if (l.includes('perfil') || l.includes('estudiante')) return 'profile';
		if (l.includes('mensaje') || l.includes('mensajeria') || l.includes('chat')) return 'message';
		if (l.includes('publicacion') || l.includes('publicaciones')) return 'publication';
		if (l.includes('stream')) return 'stream';
		if (l.includes('ayuda') || l.includes('academica') || l.includes('academic')) return 'help-academic';
		if (l.includes('admin')) return 'admin';
		if (l.includes('administrator')) return 'administrator';
	}

	return null;
}


export const permKey = (
	moduleName: string,
	action: 'read'|'create'|'update'|'delete'
): PermKey => `${normalizeModule(moduleName)}:${action}` as PermKey;

export const BYPASS_MODULES = new Set<string>(['admin', 'administrator']);

export function canAccessModule(perms: string[] | null | undefined, moduleName: string): boolean {
	const mod = normalizeModule(moduleName);

	if (BYPASS_MODULES.has(mod)) return true;

	if (!perms?.length) return false;
	const set = new Set(perms.map(p => p.toLowerCase().trim()));
	return set.has(permKey(mod, 'read'));
}

export function normalizePermList(perms: string[] | null | undefined): string[] {
	if (!perms?.length) return [];
	return perms
	.map((p) => String(p ?? '').toLowerCase().trim())
	.map((p) => {
		const [mod, act] = p.split(':');
		if (!mod || !act) return p;
		return `${normalizeModule(mod)}:${act}`;
	});
}


export const MODULES = {
	PROFILE: 'profile',
	MESSAGE: 'message',
	STREAM: 'stream',
	PUBLICATION: 'publication',
	HELP_ACADEMIC: 'help-academic',
} as const;

export const ACTIONS = {
	READ: 'read',
	CREATE: 'create',
	UPDATE: 'update',
	DELETE: 'delete',
} as const;

