// ui/features/chat/atoms/MessageBubble/incomingBubble.styles.ts
import { styled } from '@mui/system';
import mq from '../../../../../config/mq';

export const Wrapper = styled('div')({
	display: 'flex',
	marginBottom: 10,
	[mq('sm', 'min')]: { marginBottom: 15 },
});

export const Thumb = styled('div')({
	marginRight: 10,
});

export const Bubble = styled('div')({
	background: '#f0f0f0',
	color: '#333',
	padding: '10px 15px',
	borderRadius: 10,
	maxWidth: '70%',
	wordWrap: 'break-word',
	[mq('sm', 'min')]: {
		padding: '15px 20px',
		maxWidth: '80%',
	},
});

export const Time = styled('span')({
	display: 'block',
	marginTop: 5,
	fontSize: 12,
	color: '#999',
	[mq('sm', 'min')]: { fontSize: 14 },
});

