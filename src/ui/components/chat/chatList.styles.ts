import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const ChatListContainer = styled('div')({
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  [mq('sm', 'min')]: {
    padding: '15px',
  },
});

export const ChatTitle = styled('h3')({
  marginBottom: '10px',
  fontSize: '18px',
  fontWeight: 'bold',
  [mq('sm', 'min')]: {
    fontSize: '20px',
  },
});

export const ChatListItem = styled('li')({
  listStyle: 'none',
  padding: '8px 10px',
  margin: '5px 0',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#ddd',
  },
  [mq('sm', 'min')]: {
    padding: '10px 15px',
  },
});

