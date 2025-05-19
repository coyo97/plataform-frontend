import { CSSProperties } from 'react';

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
};

export const getColumnWidth = (
	span: number,
	variant: keyof typeof gridSettings
): CSSProperties => {
	const { columns, gutter } = gridSettings[variant];
	const width = `calc(${(span / columns) * 100}% - ${gutter - (gutter * span) / columns}px)`;
	return {
		width,
		marginRight: `${gutter}px`,
	};
};

