// src/ui/shared/atoms/tooltips/tooltipBubble/tooltipBubble.styles.ts
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { Theme } from '@mui/material/styles';

export const getTooltipStyles = (theme: Theme, variant: string, size: string) => {
	const base = {
		[`& .${tooltipClasses.tooltip}`]: {
			borderRadius: theme.radius.sm4x,
			padding: theme.spacing(1.5),
			maxWidth: 300,
			fontSize: theme.typography.pxToRem(13),
			boxShadow: theme.shadows[2], //  usa shadow del theme
		},
		[`& .${tooltipClasses.arrow}`]: {},
	};

	const variants: Record<string, Record<string, any>> = {
		dark: {
			[`& .${tooltipClasses.tooltip}`]: {
				...base[`& .${tooltipClasses.tooltip}`],
				backgroundColor: theme.palette.grey[900],
				color: theme.palette.common.white,
			},
			[`& .${tooltipClasses.arrow}`]: {
				color: theme.palette.grey[900],
			},
		},
		light: {
			[`& .${tooltipClasses.tooltip}`]: {
				...base[`& .${tooltipClasses.tooltip}`],
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
				boxShadow: theme.shadows[1],
			},
			[`& .${tooltipClasses.arrow}`]: {
				color: theme.palette.background.paper,
			},
		},
		primary: {
			[`& .${tooltipClasses.tooltip}`]: {
				...base[`& .${tooltipClasses.tooltip}`],
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
			},
			[`& .${tooltipClasses.arrow}`]: {
				color: theme.palette.primary.main,
			},
		},
	};

	const sizes: Record<string, Record<string, any>> = {
		small: {
			[`& .${tooltipClasses.tooltip}`]: {
				fontSize: theme.typography.pxToRem(11),
				padding: theme.spacing(1),
			},
		},
		medium: {},
		large: {
			[`& .${tooltipClasses.tooltip}`]: {
				fontSize: theme.typography.pxToRem(15),
				padding: theme.spacing(2),
			},
		},
	};

	return {
		...base,
		...(variants[variant] || variants.dark),
		...(sizes[size] || {}),
	};
};

