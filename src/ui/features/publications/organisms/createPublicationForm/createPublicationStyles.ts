import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import mq from '../../../../../config/mq';

export const FormCard = styled(Card)(({ theme }) => ({
	width: '100%',
	maxWidth: '100%',
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow: theme.shadows[4],
	overflow: 'hidden',
	[mq('xs', 'max')]: {
		margin: theme.spacing(1),
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

