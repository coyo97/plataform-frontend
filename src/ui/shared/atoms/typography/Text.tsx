// shared/atoms/typography/Text.tsx
import React from 'react';
import MuiTypography from '@mui/material/Typography';
import * as typography from '../../../../Theme/tokens/typography';

type TextVariant = keyof typeof typography.sizes;       // 'xs' 'sm' 'md' …
interface Props {
	as?     : React.ElementType;
	size?   : TextVariant;   // default 'md'
	weight? : keyof typeof typography.weights; // 'regular' 'medium' 'bold'
	colorKey?: string;       // ej. 'neutral.black.700'
	sx?: Record<string, any>;
}

const Text: React.FC<React.PropsWithChildren<Props>> = ({
	as = 'p',
	size = 'md',
	weight = 'regular',
	colorKey,
	sx = {},
	...rest
}) => (
	<MuiTypography
		component={as as any}
		sx={{
			fontSize  : typography.sizes[size],
			fontWeight: typography.weights[weight],
			color     : colorKey ? `var(--${colorKey})` : 'inherit',
			...sx,
		}}
		{...rest}
	/>
);

export default Text;

