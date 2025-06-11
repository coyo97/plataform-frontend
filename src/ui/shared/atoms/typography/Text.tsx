// shared/atoms/typography/Text.tsx
import React from 'react';
import MuiTypography from '@mui/material/Typography';
import * as typography from '../../../../Theme/tokens/typography';

type TextVariant = keyof typeof typography.sizes;       // 'xs' 'sm' 'md' …
type TextProps<T extends React.ElementType> = {
	as?: T;
	size?: TextVariant;
	weight?: keyof typeof typography.weights;
	colorKey?: string;
	sx?: Record<string, any>;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'size' | 'color'>;

const Text = <T extends React.ElementType = 'p'>({
	as,
	size = 'md',
	weight = 'regular',
	colorKey,
	sx = {},
	...rest
}: TextProps<T>) => {
	const Component = as || 'p';

	return (
		<MuiTypography
			component={Component as any}
			sx={{
				fontSize: typography.sizes[size],
				fontWeight: typography.weights[weight],
				color: colorKey ? `var(--${colorKey})` : 'inherit',
				...sx,
			}}
			{...rest}
		/>
	);
};

export default Text;

