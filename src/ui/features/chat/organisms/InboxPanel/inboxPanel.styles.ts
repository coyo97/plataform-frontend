import { styled } from '@mui/material/styles';

export const Panel = styled('aside')<{
	isMobile : boolean;
	isFloating: boolean;
	show      : boolean;
}>(({ theme, isMobile, isFloating, show }) => ({
	width        : 280,
	maxWidth     : '100%',
	height       : '100%',
	overflowY    : 'auto',
	background   : theme.palette.background.paper,
	boxShadow    : theme.shadows[2],
	transform    : (isMobile || isFloating) && !show
		? 'translateX(-100%)'
		: 'translateX(0)',
		transition   : 'transform .25s',
		zIndex       : 1100,
}));

