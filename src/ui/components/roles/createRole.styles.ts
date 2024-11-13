// src/ui/components/roles/createRole.styles.ts

import { Box, Button, TextField, Typography, MenuItem, List, ListItem, styled } from '@mui/material';

export const RoleContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    maxWidth: '600px',
    margin: '0 auto',
}));

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontSize: '1.5rem',
});

export const FormField = styled(TextField)({
    marginBottom: '1rem',
    width: '100%',
});

export const SelectField = styled(TextField)({
    marginBottom: '1rem',
    width: '100%',
});

export const PermissionList = styled(List)({
    marginTop: '1rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
});

export const PermissionItem = styled(ListItem)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
});

