import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';

export const FormWrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	maxWidth: 400,
	margin: '0 auto',
	padding: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	backgroundColor: theme.palette.background.paper,

	[mq('sm', 'max')]: {
		maxWidth: '90%',
		padding: theme.spacing(2),
	},
}));

