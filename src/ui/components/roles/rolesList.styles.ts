// src/ui/components/roles/rolesList.styles.ts
import { Box, Typography, TableContainer, TableHead, TableRow, TableCell, Button, styled } from '@mui/material';
import mq from '../../../config/mq';

export const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    [mq('sm', 'max')]: {
        padding: theme.spacing(2),
    },
}));

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontSize: '1.5rem',
});

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(2),
    [mq('sm', 'max')]: {
        display: 'block',
        overflowX: 'hidden',
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
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1),
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    [mq('sm', 'max')]: {
        display: 'flex',
        justifyContent: 'space-between',
        '&:before': {
            content: 'attr(data-label)',
            fontWeight: 'bold',
            color: theme.palette.text.secondary,
        },
    },
}));

export const PermissionList = styled('ul')({
    paddingLeft: '1rem',
    margin: 0,
    listStyleType: 'disc',
    color: '#555',
});

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
        alignSelf: 'flex-end',
    },
}));

