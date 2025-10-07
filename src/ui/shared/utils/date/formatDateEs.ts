export type TimeFormat = 'relative' | 'absolute' | 'calendar';

type Opts = {
	locale?: string;     // p.ej. 'es-BO'
	now?: Date;          // para testear o fijar referencia
};

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

const formatRelative = (date: Date, { locale='es-BO', now }: Opts) => {
	const base = now ?? new Date();
	const diffMs = date.getTime() - base.getTime();
	const abs = Math.abs(diffMs);
	const minutes = Math.round(abs / 60000);
	const hours   = Math.round(abs / 3600000);
	const days    = Math.round(abs / 86400000);

	const getRtf = (l: string) => {
		if (!rtfCache.has(l)) rtfCache.set(l, new Intl.RelativeTimeFormat(l, { numeric: 'auto' }));
		return rtfCache.get(l)!;
	};
	const rtf = getRtf(locale);

	if (minutes < 60) return rtf.format(Math.sign(diffMs) * minutes, 'minute');
	if (hours   < 24) return rtf.format(Math.sign(diffMs) * hours,   'hour');
	return rtf.format(Math.sign(diffMs) * days, 'day');
};

export const formatDateEs = (
	input: Date | number | string,
	format: TimeFormat = 'relative',
	opts: Opts = {}
) => {
	const date = typeof input === 'string' ? new Date(input) : new Date(input);
	if (isNaN(date.getTime())) return '';

	if (format === 'relative') return formatRelative(date, opts);

	if (format === 'calendar') {
		// “Calendárico” simple: hoy/ayer/mañana/fecha larga
		const now = opts.now ?? new Date();
		const d0  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
		const d1  = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
		const deltaDays = Math.round((d1 - d0) / 86400000);
		if (deltaDays === 0)  return 'Hoy';
		if (deltaDays === -1) return 'Ayer';
		if (deltaDays === 1)  return 'Mañana';
		return new Intl.DateTimeFormat(opts.locale ?? 'es-BO', { day:'numeric', month:'long' }).format(date);
	}

	// 'absolute'
	return new Intl.DateTimeFormat(opts.locale ?? 'es-BO', {
		year: 'numeric', month: 'long', day: 'numeric',
		hour: '2-digit', minute: '2-digit'
	}).format(date);
};

