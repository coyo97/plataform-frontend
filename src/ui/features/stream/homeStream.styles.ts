import { Box, Button, Input, Select, Typography, styled } from '@mui/material';

// Contenedor principal del componente
export const HomeStreamContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
	height: '100vh',
	overflowY: 'auto',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(3),
}));

// Título principal
export const Title = styled(Typography)(({ theme }) => ({
	fontWeight: 'bold',
	fontSize: '1.5rem',
	color: theme.palette.primary.main,
	textAlign: 'center',
}));

// Formulario
export const StreamForm = styled('form')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	width: '100%',
	maxWidth: '500px',
}));

// Campo de texto (input)
export const StyledInput = styled(Input)(({ theme }) => ({
	width: '100%',
	padding: theme.spacing(1),
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '1rem',
	color: theme.palette.text.primary,
	'&:focus': {
		borderColor: theme.palette.primary.main,
	},
}));

// Selector (select)
export const StyledSelect = styled(Select)(({ theme }) => ({
	width: '100%',
	padding: theme.spacing(1),
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '1rem',
	color: theme.palette.text.primary,
	'&:focus': {
		borderColor: theme.palette.primary.main,
	},
}));

// Botón principal
export const StartStreamButton = styled(Button)(({ theme }) => ({
	padding: theme.spacing(1.5),
	fontSize: '1rem',
	fontWeight: 'bold',
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
}));

// Botón de detener stream
export const StopStreamButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
	backgroundColor: theme.palette.error.main,
	color: theme.palette.error.contrastText,
	padding: theme.spacing(1.5),
	fontSize: '1rem',
	'&:hover': {
		backgroundColor: theme.palette.error.dark,
	},
}));

// Contenedor para el código de acceso
export const AccessCodeContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	marginTop: theme.spacing(2),
	padding: theme.spacing(2),
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[1],
}));

export const CopyCodeButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(1),
	padding: theme.spacing(1),
	backgroundColor: theme.palette.info.main,
	color: theme.palette.info.contrastText,
	'&:hover': {
		backgroundColor: theme.palette.info.dark,
	},
}));

