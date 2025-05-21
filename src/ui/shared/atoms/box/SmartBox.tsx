import React from 'react';
import MuiBox from '@mui/material/Box';
import { SmartBoxProps } from './box.types';
import { pad, rad, sha } from './box.helpers';

const SmartBox: React.FC<SmartBoxProps> = ({
	p, pt, pr, pb, pl,
	m, mt, mr, mb, ml,
	row, column, center, between,
	radius, shadow,
	sx = {},
	...rest
}) => {
	const flex =
		row    ? 'row'
			: column? 'column'
				: undefined;

				return (
					<MuiBox
						sx={{
							display: flex ? 'flex' : undefined,
							flexDirection: flex,
							alignItems   : center ? 'center' : undefined,
							justifyContent: between ? 'space-between' : center ? 'center' : undefined,
							p : pad(p),
							pt: pad(pt), pr: pad(pr), pb: pad(pb), pl: pad(pl),
							m : pad(m),
							mt: pad(mt), mr: pad(mr), mb: pad(mb), ml: pad(ml),
							borderRadius: rad(radius),
							boxShadow   : sha(shadow),
							...sx,
						}}
						{...rest}
					/>
				);
};

export default SmartBox;

