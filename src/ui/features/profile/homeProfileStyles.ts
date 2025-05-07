import { Box, Button, styled } from '@mui/material';

export const Sidebar = styled(Box)(({ theme }) => ({
	width: '250px',
	minHeight: '100vh',
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
	position: 'fixed',
	top: 0,
	left: 0,
	zIndex: 1000,
	padding: theme.spacing(2),
	display: 'flex',
	flexDirection: 'column',
}));

export const SidebarContent = styled(Box)({
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
});

export const SidebarNav = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	marginTop: '16px',
});

export const SidebarItem = styled(Button)(({ theme }) => ({
	justifyContent: 'flex-start',
	width: '100%',
	padding: theme.spacing(1),
	marginBottom: theme.spacing(1),
	color: theme.palette.text.primary,
	textAlign: 'left',
	'&:hover': {
		backgroundColor: theme.palette.action.hover,
	},
}));

