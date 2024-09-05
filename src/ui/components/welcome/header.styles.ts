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
  backgroundColor: `${theme.palette.colorHeader.main}`,
  color: '#fff',
  padding: '10px 0',
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

const Canvas = styled('canvas')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1, // Para que el canvas quede detrás del contenido
});

export { Wrapper, Header, Canvas };

