// src/ui/components/friends/friendsListStyles.styles.ts
import { Box, Button, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';

export const FriendsListContainer = styled(Box)({
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

export const Title = styled(Typography)({
	fontWeight: 'bold',
	marginBottom: '1rem',
	textAlign: 'center',
});

export const FriendsListItems = styled('ul')({
	listStyleType: 'none',
	padding: 0,
	width: '100%',
});

export const FriendItem = styled('li')({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '10px 0',
	borderBottom: '1px solid #ddd',
	'&:last-child': {
		borderBottom: 'none',
	},
});

export const FriendName = styled(Typography)({
	fontWeight: 'bold',
});

export const ActionButton = styled(Button)(({ theme }) => ({
	color: theme.palette.primary.contrastText,
	backgroundColor: theme.palette.primary.main,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	[mq('sm', 'max')]: {
		fontSize: '0.8rem',
		padding: '6px 8px',
	},
	margin: '0 5px', // Espacio entre botones
}));
export const ProfileImage= styled('img')`
width: 40px;
height: 40px;
border-radius: 50%; /* Hace que la imagen sea circular */
	margin-right: 10px;
object-fit: cover;
`;

