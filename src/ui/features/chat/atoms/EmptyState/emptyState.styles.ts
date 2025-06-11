// ui/features/chat/atoms/EmptyState/emptyState.styles.ts
import { styled } from '@mui/system';
import mq from '../../../../../config/mq';

export const Wrapper = styled('div')({
	textAlign: 'center',
	marginTop: '50px',
	backgroundColor: '#E3F2FD',
	padding: '20px',
	borderRadius: '10px',
	boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
	[mq('xs', 'max')]: {
		marginTop: '20px',
		padding: '15px',
	},
	[mq('md', 'min')]: {
		marginTop: '50px',
	},
});

export const Title = styled('h3')({
	marginBottom: '15px',
	fontSize: '24px',
	[mq('sm', 'min')]: {
		fontSize: '28px',
	},
});

export const Message = styled('span')({
	fontSize: '16px',
	[mq('sm', 'min')]: {
		fontSize: '18px',
	},
});

