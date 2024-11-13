// sidebar.styles.ts
import { Box, List, ListItem, Typography, styled } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
	 width: '250px', // Ajusta el ancho según sea necesario
    height: '100vh', // Altura completa de la pantalla
    position: 'fixed', // Fija el sidebar en su lugar
    backgroundColor: theme.palette.sidebar.background,
    color: theme.palette.sidebar.text,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
	overflowY: 'auto', // Permite el desplazamiento en el sidebar si es necesarios
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

