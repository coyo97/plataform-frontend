import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const ChatSelectContainer = styled('div')({
    textAlign: 'center',
    marginTop: '50px',
    backgroundColor: '#E3F2FD',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    [mq('xs', 'max')]: {
        marginTop: '20px',
        padding: '15px',
    },
    [mq('md', 'min')]: {
        marginTop: '50px',
    },
});

export const AlertBox = styled('div')({
  padding: '20px',
  borderRadius: '5px',
  backgroundColor: '#d9edf7',
  border: '1px solid #bce8f1',
  color: '#31708f',
  width: '100%',
  maxWidth: '500px',
  [mq('sm', 'min')]: {
    padding: '30px',
  },
});

export const AlertTitle = styled('h3')({
  marginBottom: '15px',
  fontSize: '24px',
  [mq('sm', 'min')]: {
    fontSize: '28px',
  },
});

export const AlertMessage = styled('span')({
  fontSize: '16px',
  [mq('sm', 'min')]: {
    fontSize: '18px',
  },
});

