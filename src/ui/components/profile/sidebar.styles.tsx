// src/ui/components/profile/sidebar.styles.tsx

import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';

export const SidebarContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open: boolean;
}>(({ theme, open }) => ({
	width: '250px',
	backgroundColor: theme.palette.primary.main,
	height: '100vh',
	position: 'fixed',
	top: 0,
	left: 0, // Siempre visible en pantallas grandes
	display: 'flex',
	flexDirection: 'column',
	padding: '20px',
	color: theme.palette.primary.contrastText,
	transition: 'left 0.3s ease-in-out',
	zIndex: 1000,

	// Solo aplicar la lógica de apertura en pantallas pequeñas
	[theme.breakpoints.down('sm')]: {
		left: open ? 0 : '-250px', // Mover el sidebar fuera de la vista cuando esté cerrado en pantallas pequeñas
	},
}));

export const SidebarLink = styled('button')(({ theme }) => ({
	background: 'none',
	border: 'none',
	color: theme.palette.primary.contrastText,
	fontSize: '16px',
	padding: '10px 0',
	textAlign: 'left',
	cursor: 'pointer',
	width: '100%',
	'&:hover': {
		backgroundColor: theme.palette.action.hover,
	},
}));

export const ContentArea = styled('div')(({ theme }) => ({
	marginLeft: '250px', // Deja espacio para el sidebar en pantallas grandes
	padding: '20px',
	flex: 1,
	width: '100%',
	[theme.breakpoints.down('sm')]: {
		marginLeft: 0, // En móvil, el contenido ocupa todo el ancho
	},
}));

export const ToggleButton = styled(IconButton)(({ theme }) => ({
	position: 'fixed',
	top: 10,
	left: 10,
	zIndex: 1100,
	color: theme.palette.primary.contrastText,
	backgroundColor: theme.palette.primary.main,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	[theme.breakpoints.up('sm')]: {
		display: 'none', // Ocultar el botón en pantallas más grandes
	},
}));

