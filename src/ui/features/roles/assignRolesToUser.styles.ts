// src/ui/components/roles/assignRolesToUser.styles.ts
import { Box, Button, Checkbox, FormControl, InputLabel, Select, Typography, styled } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
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
        textAlign: 'left', // Alinea a la izquierda en pantallas pequeñas
    },
}));

export const FormControlStyled = styled(FormControl)(({ theme }) => ({
    marginBottom: '1.5rem',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(1),
    },
}));

export const SelectStyled = styled(Select)(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem', // Tamaño más pequeño en pantallas pequeñas
    },
}));

export const CheckboxContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: '0.5rem',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column', // Apila elementos en pantallas pequeñas
        alignItems: 'flex-start',
    },
}));

export const AssignButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 2),
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    width: '100%', // Botón ocupa todo el ancho en móviles
    [theme.breakpoints.up('sm')]: {
        width: 'auto', // Ajusta tamaño automáticamente en pantallas grandes
    },
}));

