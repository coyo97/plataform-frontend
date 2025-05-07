// src/ui/components/blocked/blockedUsersListStyles.styles.ts
import { Box, Button, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';

export const BlockedUsersContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
    [mq('sm', 'max')]: {
        padding: '15px',
        maxWidth: '90%',
    },
});

export const Title = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
});

export const BlockedList = styled('ul')({
    listStyleType: 'none',
    padding: 0,
    width: '100%',
});

export const BlockedUserItem = styled('li')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
    '&:last-child': {
        borderBottom: 'none',
    },
});

export const UserName = styled(Typography)({
    fontWeight: 'bold',
});

export const UnblockButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
    [mq('sm', 'max')]: {
        fontSize: '0.8rem',
        padding: '6px 8px',
    },
}));

