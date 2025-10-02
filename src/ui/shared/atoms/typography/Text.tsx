// src/ui/shared/atoms/typography/Text.tsx
import React from 'react';
import MuiTypography from '@mui/material/Typography';
import { Theme, useTheme } from '@mui/material/styles';

type SizeKeys   = keyof typeof import('../../../../Theme/tokens/typography').sizes;
type WeightKeys = keyof typeof import('../../../../Theme/tokens/typography').weights;

type HeadingLevel = 'h1' | 'h2' | 'h3';
type DisplayLevel = 'xl' | 'lg';
type ToneSystem   = 'sans' | 'serif' | 'monospace' | 'italic';

type TextProps<T extends React.ElementType> = {
	as?: T;
	colorKey?: keyof Theme['palette'] | string;
	size?: SizeKeys;
	weight?: WeightKeys;
	headingLevel?: HeadingLevel;
	displayLevel?: DisplayLevel;
	system?: ToneSystem;
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
	sx?: Record<string, any>;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'color'>;

const Text = <T extends React.ElementType = 'p'>({
	as,
	colorKey,
	size = 'md',
	weight = 'regular',
	headingLevel,
	displayLevel,
	system = 'sans',
	align,
	sx = {},
	...rest
}: TextProps<T>) => {
	const Component = as || 'p';
	const theme = useTheme();

	let resolvedColor: string | undefined = 'inherit';
	if (colorKey) {
		const parts = String(colorKey).split('.');
		let walk: any = theme.palette;
		for (const part of parts) walk = walk?.[part];
		if (typeof walk === 'string') {
			resolvedColor = walk;
		} else if (String(colorKey) in theme.palette) {
			const entry = theme.palette[colorKey as keyof Theme['palette']];
			resolvedColor = (entry as any)?.main ?? (entry as any);
		} else {
			walk = theme.customColors as any;
			for (const part of parts) walk = walk?.[part];
			if (typeof walk === 'string') resolvedColor = walk;
		}
	}

	let typoSx: any = {
		fontFamily: theme.typography?.fontFamily,           
		fontSize:   theme.typographyTokens.sizes[size],
		fontWeight: theme.typographyTokens.weights[weight],
		lineHeight: theme.typography?.body1?.lineHeight ?? 1.6,
	};

	const T: any = theme.typographyTokens;

	if (headingLevel) {
		const node   = T.heading?.[headingLevel];                
		const branch = node?.[system] || node?.sans || node?.serif || node?.monospace || node?.italic;
		const spec   = branch?.semiBold || branch?.medium || branch?.regular;
		if (spec) {
			typoSx = {
				fontFamily:  spec.fontFamily,
				fontWeight:  spec.fontWeight,
				fontSize:    spec.fontSize,
				lineHeight:  spec.lineHeight,
				...(spec.fontStyle ? { fontStyle: spec.fontStyle } : null),
			};
		}
	} else if (displayLevel) {
		const node   = T.display?.[displayLevel];                 
		const branch = node?.[system] || node?.sans || node?.serif || node?.monospace || node?.italic;
		const spec   = branch?.medium || branch?.regular;
		if (spec) {
			typoSx = {
				fontFamily:  spec.fontFamily,
				fontWeight:  spec.fontWeight,
				fontSize:    spec.fontSize,
				lineHeight:  spec.lineHeight,
				...(spec.fontStyle ? { fontStyle: spec.fontStyle } : null),
			};
		}
	}

	return (
		<MuiTypography
			component={Component as any}
			align={align}
			sx={{ color: resolvedColor, ...typoSx, ...sx }}
			{...rest}
		/>
	);
};

export default Text;

