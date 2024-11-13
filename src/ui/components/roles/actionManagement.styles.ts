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
    },
}));

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontSize: '1.5rem',
});

export const InputContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
});

export const StyledInput = styled(InputBase)(({ theme }) => ({
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    flex: 1,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export const ActionList = styled(Box)({
    marginTop: '1rem',
});

export const ActionItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
}));

