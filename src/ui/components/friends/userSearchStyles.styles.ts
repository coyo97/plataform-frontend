// src/ui/components/profile/userSearchStyles.styles.ts
import { Box, Button, InputBase, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';

export const UserSearchContainer = styled(Box)({
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

export const SearchForm = styled('form')({
    display: 'flex',
    gap: '10px',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '20px',
    [mq('sm', 'max')]: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});

export const SearchInput = styled(InputBase)(({ theme }) => ({
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    width: '70%',
    [mq('sm', 'max')]: {
        width: '100%',
    },
}));

export const SearchButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export const ResultsList = styled('ul')({
    listStyleType: 'none',
    padding: 0,
    width: '100%',
});

export const ResultItem = styled('li')({
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

export const StatusText = styled(Typography)({
    color: 'gray',
    fontSize: '0.9rem',
});

