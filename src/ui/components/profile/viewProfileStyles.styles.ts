import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const ProfileContainer = styled('div')({
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  [mq('sm', 'min')]: {
    padding: '30px',
  },
});

export const ProfileInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

export const ProfileImage = styled('img')({
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  objectFit: 'cover',
  margin: '20px 0',
});

