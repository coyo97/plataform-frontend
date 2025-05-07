// src/ui/components/profile/updateProfile.styles.ts
import { Box, Button, TextField, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';

export const FormContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
    [mq('sm', 'max')]: {
        padding: '10px',
        maxWidth: '90%',
    },
});

export const Title = styled(Typography)({
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
});

export const StyledTextField = styled(TextField)({
    width: '100%',
});

export const StyledButton = styled(Button)({
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
});

