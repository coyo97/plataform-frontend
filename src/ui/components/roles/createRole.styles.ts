import { Box, Button, TextField, Typography, MenuItem, List, ListItem, styled } from '@mui/material';

export const RoleContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.default,
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	maxWidth: '600px',
	margin: '0 auto',
	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2),
		maxWidth: '100%', // Ocupa todo el ancho en pantallas pequeñas
	},
}));

export const Title = styled(Typography)(({ theme }) => ({
	fontWeight: 'bold',
	marginBottom: theme.spacing(2),
	fontSize: '1.5rem',
	textAlign: 'center',
	[theme.breakpoints.down('sm')]: {
		fontSize: '1.25rem',
		textAlign: 'left', // Alinear a la izquierda en pantallas pequeñas
	},
}));

export const FormField = styled(TextField)({
	marginBottom: '1rem',
	width: '100%',
});

export const SelectField = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	width: '100%',
	'& .MuiSelect-select': {
		display: 'flex',
		alignItems: 'center',
	},
	[theme.breakpoints.down('sm')]: {
		fontSize: '0.875rem',
	},
}));

export const PermissionList = styled(List)(({ theme }) => ({
	marginTop: theme.spacing(2),
	borderTop: `1px solid ${theme.palette.divider}`,
	padding: theme.spacing(1),
	maxHeight: '300px',
	overflowY: 'auto',
	[theme.breakpoints.down('sm')]: {
		maxHeight: '200px', // Ajustar tamaño para móviles
	},
}));

export const PermissionItem = styled(ListItem)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: theme.spacing(1),
	gap: theme.spacing(2),
	'&:not(:last-child)': {
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column', // Apilar elementos en móviles
		alignItems: 'stretch',
		gap: theme.spacing(1),
	},
}));

export const AddPermissionButton = styled(Button)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	fontSize: '0.875rem', // Tamaño de fuente pequeño
	padding: theme.spacing(1), // Padding compacto
	width: '100%', // Ancho completo en pantallas pequeñas
	maxWidth: '150px', // Ancho máximo para pantallas grandes
	whiteSpace: 'nowrap', // Evita desbordamiento de texto
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	[theme.breakpoints.up('sm')]: {
		width: 'auto', // Ajuste automático en pantallas grandes
		fontSize: '1rem', // Fuente normal en pantallas grandes
	},
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
	fontSize: '0.875rem', // Tamaño de fuente pequeño
	padding: theme.spacing(1), // Padding compacto
	width: '100%', // Ancho completo en pantallas pequeñas
	maxWidth: '150px', // Ancho máximo para pantallas grandes
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	[theme.breakpoints.up('sm')]: {
		width: 'auto', // Ajuste automático en pantallas grandes
		fontSize: '1rem', // Fuente normal en pantallas grandes
	},
}));
