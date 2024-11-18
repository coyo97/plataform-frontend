// src/ui/components/roles/actionManagement.styles.ts

import { Box, Button, InputBase, Typography, styled } from '@mui/material';

export const ActionManagementContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    maxWidth: '600px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        maxWidth: '100%',
    },
}));

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontSize: '1.5rem',
});

export const InputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    flex: 1,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
    fontSize: '0.875rem',
    padding: theme.spacing(1),
	width: '100%', // Ancho completo en pantallas pequeñas
    maxWidth: '150px', // Ancho máximo para pantallas grandes
    whiteSpace: 'nowrap', // Evita que el texto se desborde
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    [theme.breakpoints.up('sm')]: {
        width: 'auto', // Ajusta automáticamente el tamaño en pantallas grandes
    },
}));


export const ActionList = styled(Box)({
    marginTop: '1rem',
});

export const ActionItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
	flexDirection: 'column', // Alinea los botones en columna
    gap: theme.spacing(2), // Espaciado entre los elementos
    alignItems: 'flex-start',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
}));

