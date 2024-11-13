import { styled } from '@mui/system';
import mq from '../../../config/mq';

const Header = styled('header')(({ theme }) => ({
	backgroundColor: '#0056A8', // Azul para el fondo del header (representando colores UATF)
	color: '#FFFFFF', // Texto en blanco para contraste
	padding: '10px 0',
	display: 'flex',
	justifyContent: 'center', // Centrar el contenido en pantallas grandes
	alignItems: 'center',

	'& nav ul': {
		listStyle: 'none',
		padding: 0,
		display: 'flex',
		justifyContent: 'space-around',
		flexWrap: 'wrap', // Permitir que los elementos se ajusten si es necesario
		width: '100%',
		maxWidth: '1200px', // Limitar el ancho máximo en pantallas grandes
	},

	'& nav ul li': {
		margin: '0 10px', // Añadir espacio entre los elementos del menú
	},

	'& nav ul li a': {
		color: '#FFFFFF', // Texto en blanco
		textDecoration: 'none',
		padding: '5px', // Reducir el padding para que el menú sea más compacto
	},

	'& nav ul li a.highlight': {
		background: '#B22222', // Rojo para resaltar el botón activo o destacado
		borderRadius: '5px',
		padding: '5px 15px', // Reducir el tamaño del botón para pantallas móviles
	},

	// Media queries para pantallas pequeñas
	[mq('xs', 'max')]: {
		'& nav ul': {
			flexDirection: 'row', // Mantener el menú en una fila en pantallas pequeñas
			justifyContent: 'center', // Centrar los elementos en pantallas pequeñas
		},

		'& nav ul li': {
			margin: '5px', // Ajustar márgenes para más espacio en pantallas pequeñas
		},

		'& nav ul li a': {
			fontSize: '14px', // Ajustar el tamaño de fuente para pantallas pequeñas
		},
	},
}));

export { Header };

