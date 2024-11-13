// src/ui/components/profile/friendRequestsStyles.styles.ts
import { Box, Typography, Button, styled } from '@mui/material';
import mq from '../../../config/mq';

export const FriendRequestsContainer = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	backgroundColor: '#fff',
	borderRadius: '8px',
	boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
	maxWidth: '600px',
	margin: '0 auto',
	[mq('sm', 'max')]: {
		padding: '15px',
		maxWidth: '90%',
	},
});

export const RequestList = styled('ul')({
	listStyleType: 'none',
	padding: 0,
	width: '100%',
});

export const RequestItem = styled('li')({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '10px 0',
	borderBottom: '1px solid #ddd',
	'&:last-child': {
		borderBottom: 'none',
	},
});

export const UserName = styled(Typography)({
	fontWeight: 'bold',
});

export const ActionButtons = styled(Box)({
	display: 'flex',
	gap: '10px',
});

export const StyledButton = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	[mq('sm', 'max')]: {
		fontSize: '0.8rem',
		padding: '6px 8px',
	},
}));

