import { CSSProperties } from 'react';
import mq, {breakPoints} from '../../../../config/mq';

export const gridSettings = {
	mobile: {
		containerWidth: 398,
		marginX: 16,
		columns: 4,
		gutter: 16,
	},
	tablet: {
		containerWidth: 786,
		marginX: 24,
		columns: 6,
		gutter: 24,
	},
	desktopFixed: {
		containerWidth: 1200,
		marginX: 120,
		columns: 12,
		gutter: 24,
	},
	desktopFluid: {
		containerWidth: 1392,
		marginX: 24,
		columns: 12,
		gutter: 24,
	},
	vertical: {
		containerWidth: 320,
		marginX: 0,
		columns: 1,
		gutter: 8,
	},
};

// helper antiguo (flexbox)
export const getColumnWidth = (
	span: number,
	variant: keyof typeof gridSettings
): CSSProperties => {
	const { columns, gutter } = gridSettings[variant];
	const width = `calc(${(span / columns) * 100}% - ${
		gutter - (gutter * span) / columns
	}px)`;
	return {
		width,
		marginRight: `${gutter}px`,
	};
};

// grid moderno: span fijo
export const getColumnSpan = (span: number): CSSProperties => ({
	gridColumn: `span ${span}`,
});

// Paso 2: span responsivo con breakpoints
export const getResponsiveSpan = (
	span: number | Partial<Record<keyof typeof breakPoints.values, number>>
): CSSProperties => {
	if (typeof span === 'number') {
		return { gridColumn: `span ${span}` };
	}

	const base: CSSProperties = {};
	(Object.keys(span) as (keyof typeof breakPoints.values)[]).forEach((bp) => {
		const value = span[bp];
		if (value) {
			// usa media query de tu mq.ts
			(base as any)[mq(bp, 'min')] = { gridColumn: `span ${value}` };
		}
	});

	return base;
};

