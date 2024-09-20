import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const ChatListItem = styled('div')<{ isActive: boolean }>(({ isActive, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  cursor: 'pointer',
  backgroundColor: isActive ? theme.palette.primary.light : '#fff',
  borderBottom: '1px solid #ddd',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

export const ChatPeople = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const ChatImage = styled('img')({
  width: '50px',
  height: '50px',
  objectFit: 'cover',
  borderRadius: '50%',
  marginRight: '10px',
});

export const ChatInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  h5: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
});

