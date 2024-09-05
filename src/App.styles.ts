import { styled } from '@mui/system';
import mq from '../src/config/mq';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  fontFamily: 'Inter-Regular',
  [mq('xxs', 'max')]: { // Especifica 'max' como el segundo argumento
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  [mq('md', 'min')]: { // Especifica 'min' como el segundo argumento
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '10px',
  },
}));

export default Wrapper;

