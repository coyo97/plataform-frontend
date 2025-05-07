// src/ui/components/publications/createPublicationStyles.ts
import { styled } from '@mui/material/styles';
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	TextField,
	Select,
	Button,
} from '@mui/material';
import mq from '../../../config/mq';

/* Tarjeta principal */
export const FormCard = styled(Card)(({ theme }) => ({
	maxWidth: 640,
	margin: 'auto',
	borderRadius: 20,
	boxShadow: theme.shadows[4],
	transition: 'box-shadow .25s',
	'&:hover': { boxShadow: theme.shadows[8] },
	[mq('xs', 'max')]: { margin: theme.spacing(1) },
}));

/* Cabecera */
export const FormHeader = styled(CardHeader)(({ theme }) => ({
	background: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	textAlign: 'center',
	'& .MuiCardHeader-title': {
		fontSize: '1.4rem',
		fontWeight: 600,
	},
}));

/* Contenido como grid */
export const FormBody = styled(CardContent)(({ theme }) => ({
	display: 'grid',
	gap: theme.spacing(3),
}));

/* Botonera */
export const FormActions = styled(CardActions)(({ theme }) => ({
	justifyContent: 'flex-end',
	padding: theme.spacing(2, 3),
}));

/* Campos */
export const StyledTextField = styled(TextField)({
	width: '100%',
});
export const StyledSelect = styled(Select)({
	width: '100%',
});
export const StyledButton = styled(Button)(({ theme }) => ({
	paddingInline: theme.spacing(4),
	textTransform: 'none',
	borderRadius: theme.shape.borderRadius,
}));

