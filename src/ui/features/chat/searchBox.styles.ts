import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const SearchboxContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #ddd',
  [mq('xs', 'min')]: {
    padding: '15px',
  },
});

export const Heading = styled('h4')({
  margin: '0',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
});

export const SearchBar = styled('div')({
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'space-between',
});

export const SearchButton = styled('button')({
  backgroundColor: 'transparent',
  color: '#dc3545',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: '5px 10px',
});

