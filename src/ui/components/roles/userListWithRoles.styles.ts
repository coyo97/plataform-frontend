import { styled, TableContainer, TableRow, TableCell, Typography, Box } from '@mui/material';
import mq from '../../../config/mq';

export const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    [mq('sm', 'max')]: {
        padding: theme.spacing(2),
    },
}));

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    [mq('md', 'max')]: {
        fontSize: '1.25rem',
    },
    [mq('lg', 'min')]: {
        fontSize: '1.5rem',
    },
});

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    [mq('md', 'max')]: {
        display: 'block',
        padding: theme.spacing(2),
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    [mq('sm', 'max')]: {
        fontSize: '0.8rem',
        fontWeight: 'normal',
    },
    [mq('md', 'max')]: {
        fontSize: '0.9rem',
    },
    [mq('lg', 'min')]: {
        fontSize: '1rem',
    },
}));

