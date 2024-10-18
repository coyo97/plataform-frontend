import { styled } from '@mui/system';
import mq from '../../../config/mq'; // Media queries personalizadas de tu configuración

export const Sidebar = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  position: 'fixed',
  left: isOpen ? '0' : '-250px', // Mueve el sidebar dentro o fuera
  top: 0,
  width: '250px',
  height: '100%',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  transition: 'left 0.3s ease',
  zIndex: 1100, // Asegúrate de que el sidebar esté encima del header
  overflowY: 'auto', // Permite que el contenido largo sea desplazable
  [mq('xs', 'max')]: {
    width: '200px', // Ajuste para pantallas pequeñas
  },
}));

export const SidebarContent = styled('div')(({ theme }) => ({
	padding: '20px',
	h3: {
		marginBottom: '20px',
		color: theme.palette.colorButton.second, // Color de botón secundario
	},
	ul: {
		listStyle: 'none',
		padding: 0,
		li: {
			marginBottom: '10px',
			fontWeight: 'bold',
			'&.read': {
				fontWeight: 'normal',
			},
		},
	},
	button: {
		marginTop: '20px',
		backgroundColor: theme.palette.colorButton.main, // Color principal del botón
		color: theme.palette.primary.contrastText, // Texto de contraste
		padding: '10px',
		border: 'none',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.palette.colorButton.second, // Color secundario al hover
		},
	},
}));

