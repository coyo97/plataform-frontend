import { styled } from '@mui/material/styles';
import { radius } from '../../../../../Theme/tokens/radius';

export const Bubble = styled('div')<{ variant:'incoming'|'outgoing' }>(({ theme, variant }) => ({
	maxWidth     : '80%',
	padding      : theme.spacing(1.25, 1.5),
	borderRadius : radius.md,
	background   : variant === 'outgoing'
		? theme.palette.primary.main
		: theme.palette.grey[100],
		color        : variant === 'outgoing'
			? theme.palette.primary.contrastText
			: theme.palette.text.primary,
			alignSelf    : variant === 'outgoing' ? 'flex-end' : 'flex-start',
			wordBreak    : 'break-word',
}));

export const Meta = styled('span')(({ theme }) => ({
	display    : 'block',
	marginTop  : theme.spacing(0.5),
	fontSize   : 12,
	color      : theme.palette.text.secondary,
	textAlign  : 'right',
}));

