import { Box, Button, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';

export const ModuleManagementContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.default,
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	width: '100%',
	maxWidth: '800px',
	margin: '0 auto', // Centrar el contenido en pantallas grandes
	[mq('sm', 'max')]: {
		padding: theme.spacing(2),
		maxWidth: '100%', // Ocupa todo el ancho en pantallas pequeñas
	},
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 'bold',
	marginBottom: '1rem',
	textAlign: 'center',
	width: '100%',
	wordWrap: 'break-word',
	wordBreak: 'break-word', // Permite que el texto se ajuste en varias líneas
	[theme.breakpoints.down('sm')]: {
		fontSize: '1.2rem',
		textAlign: 'left',
	},
	[theme.breakpoints.up('md')]: {
		fontSize: '1.5rem',
	},
}));

export const ModuleList = styled('ul')({
	listStyle: 'none',
	padding: 0,
	margin: 0,
	width: '100%',
});

export const ModuleItem = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column', // Por defecto, los elementos estarán en columna
	alignItems: 'flex-start', // Alinear texto a la izquierda
	justifyContent: 'space-between',
	padding: theme.spacing(1),
	borderBottom: `1px solid ${theme.palette.divider}`,
	gap: theme.spacing(1),
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
	[theme.breakpoints.up('sm')]: {
		flexDirection: 'row', // En pantallas más grandes, alinear en fila
		alignItems: 'center',
	},
}));

export const ActionButton = styled(Button)(({ theme }) => ({
	fontSize: '0.875rem',
	padding: theme.spacing(1),
	width: '100%', // Ocupa el ancho completo en móviles
	[theme.breakpoints.up('sm')]: {
		width: 'auto', // Ajustar tamaño automáticamente en pantallas grandes
	},
}));

export const InputContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	marginBottom: theme.spacing(3),
	alignItems: 'stretch', // Asegura que los elementos ocupen el ancho disponible
	[theme.breakpoints.up('sm')]: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));

