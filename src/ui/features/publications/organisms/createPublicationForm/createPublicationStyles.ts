import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import mq from '../../../../../config/mq';

export const FormCard = styled(Card)(({ theme }) => ({
	width: '100%',
	maxWidth: '100%',
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow: theme.shadows[4],
	overflow: 'hidden',
	padding: theme.spacing(2),
	[mq('xs', 'max')]: {
		margin: theme.spacing(1),
		padding: theme.spacing(1.5),
	},
}));

export const FormHeader = styled(CardHeader)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	textAlign: 'center',
	'& .MuiCardHeader-title': {
		fontSize: '1.4rem',
		fontWeight: 600,
	},
}));

