import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';
import { SidebarVariant, SidebarPosition } from './sidebar.types';
import { radius } from '../../../../Theme/tokens/radius';

const variantStyles = (variant: SidebarVariant, theme: any) => {
	switch (variant) {
		case 'modal':
			return {
			background: theme.palette.background.paper,
			color: theme.palette.text.primary,
			boxShadow: theme.shadows[6],
		};
		case 'primary':
			return {
			background: theme.palette.primary.main,
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
			return {
			background: 'transparent',
			color: theme.palette.text.primary,
			boxShadow: 'none',
			padding: 0,
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

	...(variant === 'modal'
		? {
			position: 'fixed',
			top: 0,
			[position]: 0,
			height: '100dvh',
			zIndex: theme.zIndex.modal + 1, // encima del overlay
			transform: open
				? 'translateX(0)'
				: `translateX(${position === 'left' ? '-100%' : '100%'})`,
		}
			: sticky
				? {
					position: 'sticky',
					top: 'calc(var(--header-h) + 4px)',
					maxHeight: 'calc(100vh - var(--header-h) - 4px)',
					overflowY: 'auto',
				}
					: {
						position: 'fixed',
						top: 'calc(var(--header-h) + 4px)',
						[position]: 0,
						height: 'calc(100vh - var(--header-h) - 4px)',
						zIndex: theme.zIndex.drawer,
					}),

					[mq('sm', 'max')]: {
						position: 'fixed',
						top: variant === 'modal' ? 0 : 'calc(var(--header-h) + 4px)',
						[position]: 0,
						height: variant === 'modal' ? '100dvh' : '100vh',
						zIndex: variant === 'modal' ? theme.zIndex.modal + 1 : theme.zIndex.drawer,
						boxShadow: theme.shadows[3],
					},
}));

export const SidebarContent = styled('div')({
	flexGrow: 1,
	overflowY: 'auto',
	overflowX: 'hidden',
});

export const Overlay = styled('div')(({ theme }) => ({
	position: 'fixed',
	inset: 0,
	background: 'rgba(0,0,0,0.4)',
	zIndex: theme.zIndex.modal,
}));

