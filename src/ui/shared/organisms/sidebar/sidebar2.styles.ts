import { styled } from '@mui/material/styles';
import { SidebarVariant, SidebarPosition } from './sidebar2.types';
import { radius } from '../../../../Theme/tokens/radius';
import mq from '../../../../config/mq';
import {style} from '@mui/system';

export const Sidebar2Container = styled('nav', {
	shouldForwardProp: (prop) =>
		!['open', 'sticky', 'width', 'variant', 'position'].includes(prop as string),
})<{
	open?: boolean;
	sticky?: boolean;
	width: string | number;
	variant: SidebarVariant;
	position: SidebarPosition;
}>(({ theme, width, variant, sticky, position, open }) => ({
	width,
	minWidth: 0,
	flexShrink: 0,
	boxSizing: 'border-box',
	padding: theme.spacing(1),
	display: 'flex',
	flexDirection: 'column',
	borderRadius: radius.sm4x,
	...variantStyles(variant, theme),

	//Desktop left fixed o sticky
	...(sticky
		? {
			position: 'sticky',
			top: 0,
			maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing( 4,)})`,
			overflowY: 'auto'
		}
		: {
			position: 'fixed',
			top: 0,
			[position]: 0,
			height: '100vh',
		}),
		//mobile beha
		[mq('sm', 'max')]: {
			position: 'fixed',
			top: 0,
			[position]: 0,
			height: '100vh',
			transform: open
				? 'translateX(0)'
				: `translateX(${position === 'left' ?'-100%' : '100%'})`,
			zIndex: 1300,
			boxShadow: theme.shadows[3],
			transition: 'transform 0.3s ease',
		}
}));

const variantStyles = (variant: SidebarVariant, theme: any) => {
	switch(variant) {
		case 'primary':
			return {
			background: theme.palette.primary.dark,
			color: theme.palette.primary.contrastText
		};
		case 'surface':
			return {
			background: theme.palette.background.paper,
			color: theme.palette.text.primary,
			boxShadow: theme.shadows[1]
		}
		case 'elevated':
			return {
			background: theme.palette.background.paper,
			color: theme.palette.text.primary,
			boxShadow: theme.shadows[4]
		}
		case 'flat':
			return {
			background: 'transparent',
			color: theme.palette.background.paper,
			boxShadow: 'none',
			padding: 0
		}
		default:
			return {
			background: (theme as any).palette.sidebar?.background ?? theme.palette.grey[100],
			color: (theme as any).palette.sidebar?.text ?? theme.palette.text.primary,
		}
	}
}

export const Sidebar2Content = styled('div') ({
	flexGrow: 1,
	overflowY: 'auto',
	overflowX: 'hidden'
});
export const Sidebar2Overlay = styled('div')(({theme}) =>({
	position: 'fixed',
	inset: 0,
	background: 'rgba(0,0,0,0.4)',
	zIndex: 1299,
}))
