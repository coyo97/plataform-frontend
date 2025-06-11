import { styled } from '@mui/material/styles';
import { radius } from '../../../../../Theme/tokens/radius';

export const List = styled('ul')({
	listStyle: 'none',
	margin : 0,
	padding: 0,
});

export const Item = styled('li')<{ active?: boolean }>(({ theme, active }) => ({
	padding      : theme.spacing(1, 2),
	borderRadius : radius.sm3x,
	cursor       : 'pointer',
	background   : active ? theme.palette.primary.light : 'transparent',
	color        : active ? theme.palette.primary.contrastText : theme.palette.text.primary,
	'&:hover'    : {
		background: theme.palette.action.hover,
	},
}));

