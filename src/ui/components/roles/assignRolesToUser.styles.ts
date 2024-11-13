// src/ui/components/roles/assignRolesToUser.styles.ts
import { Box, Button, Checkbox, FormControl, InputLabel, Select, Typography, styled } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
}));

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontSize: '1.5rem',
});

export const FormControlStyled = styled(FormControl)({
    marginBottom: '1.5rem',
    width: '100%',
});

export const SelectStyled = styled(Select)(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
}));

export const CheckboxContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
});

export const AssignButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

