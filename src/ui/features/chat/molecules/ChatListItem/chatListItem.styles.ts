import { styled } from '@mui/material/styles';

export const ItemWrap = styled('li')<{active:boolean}>(({ theme, active }) => ({
	listStyle   :'none',
	display     :'flex',
	alignItems  :'center',
	gap         : theme.spacing(1),
	padding     : theme.spacing(1, 1.5),
	borderRadius: theme.radius.sm4x,
	cursor      :'pointer',
	background  : active ? theme.palette.action.hover : 'transparent',
	'&:hover'   : { background: theme.palette.action.hover },
}));

