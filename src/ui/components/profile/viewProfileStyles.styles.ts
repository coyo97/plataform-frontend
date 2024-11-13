// src/ui/components/profile/viewProfileStyles.styles.ts
import { Box, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';

export const ProfileContainer = styled(Box)({
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

export const ProfileInfo = styled(Box)({
    textAlign: 'center',
    '& p': {
        marginBottom: '8px',
    },
});

export const ProfileImage = styled('img')({
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '20px 0',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    [mq('sm', 'max')]: {
        width: '120px',
        height: '120px',
    },
});

