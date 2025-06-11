// peoplePanel.styles.ts
import { styled } from '@mui/material/styles';
import mq from '../../../../../config/mq';
import { padding } from '../../../../../Theme/tokens/padding';

export const Wrapper = styled('aside', {
	shouldForwardProp: p => p !== 'show',
})<{ show:boolean; floating:boolean }>(
({ show, floating }) => ({
	display: show ? 'flex' : 'none',
	flexDirection:'column',
	width: floating ? '100%' : 280,
	maxHeight:'100%',
	overflowY:'auto',
	padding: padding.px8,
	transition:'width .25s',
	[mq('xs','max')]: {
		width:'100%',
	},
}),
);

export const ToggleBtn = styled('button')(({ theme }) => ({
	position:'absolute',
	top:8,
	left:8,
	zIndex:1000,
	border:'none',
	background: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	borderRadius: theme.shape.borderRadius,
	padding:'4px 6px',
	cursor:'pointer',
}));

