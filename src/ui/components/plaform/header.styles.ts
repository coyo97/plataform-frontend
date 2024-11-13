// header.styles.ts
import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const MenuIconStyled = styled(MenuIcon)(({ theme }) => ({
  width: '24px',
  height: '24px',
  fill: '#fff',
}));

export const MenuButton = styled('button')(({ theme }) => ({
  display: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  [mq('sm', 'max')]: {
    display: 'block',
  },
}));

export const NotificationsIconStyled = styled(NotificationsIcon)(({ theme }) => ({
  width: '24px',
  height: '24px',
  fill: '#fff',
}));

export const NotificationsButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  color: '#fff',
  marginLeft: '20px', // Ajusta el margen según tus necesidades
}));

export const NotificationsContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '60px',
  right: '10px',
  width: '300px',
  maxHeight: '400px',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  borderRadius: '4px',
  zIndex: 1000,
  padding: '10px',
}));

export const Header = styled('header')<{ isMenuOpen: boolean }>(({ theme, isMenuOpen }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  backgroundColor: theme.palette.colorHeader.main,
  color: '#fff',
  padding: '10px 20px',
  zIndex: 1000,

  '& nav': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative', // Para posicionar correctamente el NotificationsContainer
  },

  '& .logo': {
    marginRight: '20px',
    a: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '1.5em',
      fontWeight: 'bold',
    },
  },

  // Especificamos que estos estilos solo afecten al menú principal
  '& nav > ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',

    [mq('sm', 'max')]: {
      display: isMenuOpen ? 'flex' : 'none',
      position: 'absolute',
      top: '60px',
      left: 0,
      width: '100%',
      flexDirection: 'column',
      backgroundColor: theme.palette.colorHeader.main,
    },
  },

  '& nav > ul > li': {
    margin: '0 10px',

    [mq('sm', 'max')]: {
      margin: '10px 0',
      textAlign: 'center',
    },
  },

  '& nav > ul > li > a': {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px',
    fontFamily: theme.typography.fontFamily,
  },

  '& nav > ul > li > a.highlight': {
    backgroundColor: theme.palette.colorButton.main,
    borderRadius: '5px',
    padding: '10px 20px',
  },
}));

