// sidebar.styles.ts
import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';
import { SidebarVariant, SidebarPosition } from './sidebar.types';
import { radius } from '../../../../Theme/tokens/radius';

const variantStyles = (variant: SidebarVariant, theme: any) => {
	switch (variant) {
		case 'primary':
			return {
			background: theme.customColors.gradients.lavenderBloom,
			color: theme.palette.common.white,
			boxShadow: theme.shadows[3],
		};
		case 'surface':
			return {
			background: theme.palette.background.paper,
			color: theme.palette.text.primary,
			boxShadow: theme.shadows[1],
		};
		case 'elevated':
			return {
			background: theme.palette.background.paper,
			color: theme.palette.text.primary,
			boxShadow: theme.shadows[4],
		};
		case 'flat':
			return {                 // sin fondo, sin shadow
			background: 'transparent',
			color     : theme.palette.text.primary,
			boxShadow  : 'none',
			padding    : 0,        // opcional: sin padding
		};
		default:
			return {
			background: theme.palette.background.paper,
			color: theme.palette.text.primary,
			borderRight: `1px solid ${theme.palette.divider}`,
		};
	}
};


export const SidebarContainer = styled('nav', {
	shouldForwardProp: (prop) =>
		!['open', 'sticky', 'width', 'variant', 'position'].includes(prop as string),
})<{
	open?: boolean;
	sticky?: boolean;
	width: string | number;
	variant: SidebarVariant;
	position: SidebarPosition;
}>(({ theme, open = true, sticky, width, variant, position }) => ({
	width,
	minWidth: 0,
	flexShrink: 0,
	boxSizing: 'border-box',
	padding: theme.spacing(1),
	display: 'flex',
	flexDirection: 'column',
	borderRadius: radius.sm4x,
	transition: 'transform 0.3s ease',
	overflowX: 'hidden',
	...variantStyles(variant, theme),

	...(sticky
		? {
			position: 'sticky',
			top: `calc(${theme.spacing(0)})`,
			maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(4)})`,
			overflowY: 'auto',
		}
			: { position: 'fixed', top: 0, [position]: 0, height: '100vh' }),

			// Mobile: slide-in/out
			[mq('sm', 'max')]: {
				position: 'fixed',
				top: 0,
				[position]: 0,
				height: '100vh',
				transform: open
					? 'translateX(0)'
					: `translateX(${position === 'left' ? '-100%' : '100%'})`,
					zIndex: 1300,
					boxShadow: theme.shadows[3],
			},

			// ✅ Medium screens: shrink sidebar
			[theme.breakpoints.between('sm', 'md')]: {
				width: '180px', // instead of 220px
			},

			// ✅ Large screens: full width
			[theme.breakpoints.up('md')]: {
				width: typeof width === 'number' ? `${width}px` : width,
			},
}));


export const SidebarContent = styled('div')({
	flexGrow: 1,
	overflowY: 'auto',
	overflowX   : 'hidden',
});

export const Overlay = styled('div')(({ theme }) => ({
	position: 'fixed',
	inset: 0,
	background: 'rgba(0,0,0,0.4)',
	zIndex: 1299,
}));

