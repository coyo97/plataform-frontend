import React from 'react';
import MuiBox from '@mui/material/Box';
import { SmartBoxProps } from './box.types';
import { pad, rad, sha } from './box.helpers';

const resolveResponsiveFlexDirection = (
	row?: SmartBoxProps['row'],
	column?: SmartBoxProps['column']
): any => {
	if (typeof row === 'object') {
		return Object.fromEntries(
			Object.entries(row).map(([key, val]) => [key, val ? 'row' : undefined])
		);
	}
	if (typeof column === 'object') {
		return Object.fromEntries(
			Object.entries(column).map(([key, val]) => [key, val ? 'column' : undefined])
		);
	}
	if (row) return 'row';
	if (column) return 'column';
	return undefined;
};

const SmartBox: React.FC<SmartBoxProps> = ({
	p, pt, pr, pb, pl,
	m, mt, mr, mb, ml,
	row, column, center, between,
	radius, shadow,
	sx = {},
	...rest
}) => {
	const flexDirection = resolveResponsiveFlexDirection(row, column);

	return (
		<MuiBox
			sx={{
				display: (flexDirection || center || between) ? 'flex' : undefined,
				flexDirection,
				alignItems: center ? 'center' : undefined,
				justifyContent: between ? 'space-between' : center ? 'center' : undefined,
				p: pad(p),
				pt: pad(pt), pr: pad(pr), pb: pad(pb), pl: pad(pl),
				m: pad(m),
				mt: pad(mt), mr: pad(mr), mb: pad(mb), ml: pad(ml),
				borderRadius: rad(radius),
				boxShadow: sha(shadow),
				...sx,
			}}
			{...rest}
		/>
	);
};

export default SmartBox;

