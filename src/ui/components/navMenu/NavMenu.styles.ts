import { styled } from '@mui/system';
import mq from '../../../config/mq';
import { Theme } from '@mui/material/styles';

// Define the wrapper style using styled
const Wrapper = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  fontFamily: 'Inter-Regular',
  [mq('xxs', 'max')]: {
    display: 'none',
  },
  [mq('md', 'min')]: {
    display: 'block',
    width: '230px',
    height: '696px',
    marginLeft: '-10px',
    marginTop: '-20px',
  },
}));

export default Wrapper;

