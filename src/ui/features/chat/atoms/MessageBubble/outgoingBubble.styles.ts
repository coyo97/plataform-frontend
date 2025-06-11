// ui/features/chat/atoms/MessageBubble/outgoingBubble.styles.ts
import { styled } from '@mui/system';
import mq from '../../../../../config/mq';
import { radius } from '../../../../../Theme/tokens/radius';
import { colors } from '../../../../../Theme/tokens/colors';

export const Wrapper = styled('div')({
	display: 'flex',
	justifyContent: 'flex-end',
	marginBottom: 10,
	[mq('sm','min')]: { marginBottom: 15 },
});

export const Bubble = styled('div')({
	position: 'relative',
	background: colors.brand.primary[700],
	color: colors.neutral.white[900],
	padding: '10px 15px',
	borderRadius: radius.sm4x,
	maxWidth: '70%',
	wordWrap: 'break-word',
	boxShadow: '0 2px 5px rgba(0,0,0,.2)',
	[mq('sm','min')]: {
		padding: '15px 20px',
		maxWidth: '80%',
	},
});

export const Time = styled('span')({
	display: 'block',
	marginTop: 5,
	fontSize: 12,
	color: colors.neutral.white[900],
	textAlign: 'right',
	[mq('sm','min')]: { fontSize: 14 },
});

export const FileImg = styled('img')({
	maxWidth: '100%',
	borderRadius: radius.sm,
	display: 'block',
});

export const FileLink = styled('a')({
	color: colors.neutral.white[900],
	textDecoration: 'underline',
});

