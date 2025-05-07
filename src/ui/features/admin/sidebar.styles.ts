// sidebar.styles.ts
import { Box, List, ListItem, Typography, styled, Button } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
	width: '250px',
	height: '100vh',
	position: 'fixed',
	top: 0, // Asegurar que el Sidebar esté en la parte superior de la página
	left: 0, // Asegurar que el Sidebar esté alineado a la izquierda
	backgroundColor: theme.palette.sidebar.background,
	color: theme.palette.sidebar.text,
	padding: theme.spacing(2),
	display: 'flex',
	flexDirection: 'column',
	boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
	overflowY: 'auto',
	zIndex: 1000, // Agrega un z-index alto
}));

export const SidebarHeader = styled(Typography)({
	textAlign: 'center',
	fontWeight: 'bold',
	marginBottom: '1rem',
});

export const SidebarList = styled(List)({
	listStyle: 'none',
	padding: 0,
	marginTop: '1rem',
	flexGrow: 1,
});

export const SidebarListItem = styled(ListItem)(({ theme }) => ({
	margin: `${theme.spacing(1)} 0`,
	padding: theme.spacing(1),
	borderRadius: theme.shape.borderRadius,
	'&:hover': {
		backgroundColor: theme.palette.sidebar.hover,
		color: theme.palette.sidebar.text,
		'& a': {
			color: theme.palette.sidebar.text,
		},
	},
	'& a': {
		color: theme.palette.sidebar.link,
		textDecoration: 'none',
		display: 'flex',
		alignItems: 'center',
	},
	'& svg': {
		marginRight: theme.spacing(1),
	},
}));

export const SidebarFooter = styled(Box)(({ theme }) => ({
	textAlign: 'center',
	padding: '1rem 0',
	borderTop: `1px solid ${theme.palette.sidebar.text}`,
}));
export const BackButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	width: '100%',
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
}));
