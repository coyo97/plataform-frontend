// header.styles.ts
import { styled } from '@mui/system';
import mq from '../../../config/mq'; // Asegúrate de que `mq` siga siendo compatible

const Wrapper = styled('div')(({ theme }) => ({
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

const Header = styled('header')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  transition: 'transform 0.3s ease-in-out',
  backgroundColor: `${theme.palette.colorHeader.main}`,
  color: '#fff',
  padding: '10px 0',
  zIndex: 1000,
  transform: 'translateY(0)',
  '&.hidden': {
    transform: 'translateY(-100%)',
  },
  '& nav ul': {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  },
  '& nav ul li': {
    display: 'inline',
  },
  '& nav ul li a': {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px',
  },
  '& nav ul li a.highlight': {
    background: '#007BFF',
    borderRadius: '5px',
    padding: '10px 20px',
  },
}));

const ToggleButton = styled('button')(({ theme }) => ({
  position: 'fixed',
  top: '10px',
  right: '10px',
  backgroundColor: `${theme.palette.primary.main}`,
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
  '&:hover': {
    backgroundColor: `${theme.palette.secondary.main}`,
  },
}));

const ArrowIcon = styled('span')<{ isHidden: boolean }>(({ isHidden }) => ({
  display: 'block',
  width: '12px',
  height: '12px',
  borderRight: '2px solid #fff',
  borderBottom: '2px solid #fff',
  transform: isHidden ? 'rotate(45deg)' : 'rotate(-135deg)',
  transition: 'transform 0.3s ease-in-out',
}));

export { Wrapper, Header, ToggleButton, ArrowIcon };

