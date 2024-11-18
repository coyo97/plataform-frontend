import { Box, Typography, TableContainer, TableHead, TableRow, TableCell, Button, styled } from '@mui/material';
import mq from '../../../config/mq';

export const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.default,
	borderRadius: theme.shape.borderRadius,
	width: '100%',
	maxWidth: '800px', // Limitar ancho en pantallas grandes
	margin: '0 auto',
	[mq('sm', 'max')]: {
		padding: theme.spacing(2),
	},
}));

export const Title = styled(Typography)(({ theme }) => ({
	fontWeight: 'bold',
	marginBottom: theme.spacing(2),
	fontSize: '1.5rem',
	textAlign: 'center',
	[mq('sm', 'max')]: {
		fontSize: '1.25rem',
		textAlign: 'left', // Alineado a la izquierda en pantallas pequeñas
	},
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	boxShadow: theme.shadows[3],
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.background.paper,
	marginTop: theme.spacing(2),
	[mq('sm', 'max')]: {
		display: 'block',
		overflowX: 'auto', // Permite desplazamiento horizontal en pantallas pequeñas
	},
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
	backgroundColor: theme.palette.primary.light,
	[mq('sm', 'max')]: {
		display: 'none', // Oculta el encabezado en pantallas pequeñas
	},
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	[mq('sm', 'max')]: {
		display: 'block',
		marginBottom: theme.spacing(2),
		borderBottom: `1px solid ${theme.palette.divider}`,
		borderRadius: theme.shape.borderRadius,
		boxShadow: theme.shadows[1],
		padding: theme.spacing(2),
	},
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	padding: theme.spacing(1),
	fontWeight: 'bold',
	color: theme.palette.text.primary,
	[mq('sm', 'max')]: {
		display: 'block',
		width: '100%',
		textAlign: 'left', // Alinea el texto a la izquierda
		padding: theme.spacing(1.5), // Espaciado interno
		'&:before': {
			content: 'attr(data-label)',
			display: 'block',
			fontWeight: 'bold',
			color: theme.palette.text.secondary,
			marginBottom: theme.spacing(0.5), // Espaciado entre la etiqueta y el contenido
		},
	},
}));


export const PermissionList = styled('ul')(({ theme }) => ({
	paddingLeft: theme.spacing(2),
	margin: 0,
	listStyleType: 'disc',
	color: '#555',
	[mq('sm', 'max')]: {
		paddingLeft: theme.spacing(1),
		fontSize: '0.9rem', // Reducir tamaño de fuente en móviles
		lineHeight: 1.5, // Mejorar espaciado entre elementos
	},
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
	color: theme.palette.error.contrastText,
	backgroundColor: theme.palette.error.main,
	'&:hover': {
		backgroundColor: theme.palette.error.dark,
	},
	marginTop: theme.spacing(1),
	fontSize: '0.8rem',
	padding: theme.spacing(0.5, 1),
	[mq('sm', 'max')]: {
		width: '100%', // Botón ocupa el ancho completo en móviles
		maxWidth: '150px',
		fontSize: '0.75rem',
		alignSelf: 'center', // Centrar horizontalmente
	},
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-between',
	gap: theme.spacing(1),
	[mq('sm', 'max')]: {
		flexDirection: 'row', // Asegurar que los botones estén en fila
		width: '100%',
	},
}));

