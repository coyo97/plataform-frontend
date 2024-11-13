import { Box, Button, TextField, Typography, styled } from '@mui/material';

export const ModuleManagementContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

export const SectionTitle = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
});

export const InputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
    },
}));

export const ModuleList = styled('ul')({
    listStyle: 'none',
    padding: 0,
});

export const ModuleItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
}));

