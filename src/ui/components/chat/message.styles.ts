import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const MesgsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%', // Ajustar al 100% del ancho disponible
    padding: '10px',
    overflowY: 'auto',
    [mq('sm', 'min')]: {
        padding: '20px',
    },
});

export const MsgHistory = styled('div')({
    flex: '1',
    overflowY: 'auto',
    marginBottom: '20px',
    [mq('md', 'min')]: {
        padding: '10px',
    },
});

export const MessageInputForm = styled('form')({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
    padding: '10px 0',
	width: '100%', // Asegura que ocupe el espacio necesario
});

export const MessageInput = styled('textarea')(({ theme }) => ({
    flex: '1',
    padding: '10px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    marginRight: '10px',
    minHeight: '40px', // Altura mínima para empezar
    maxHeight: '120px', // Altura máxima que puede alcanzar el textarea
    width: '100%', // Ajustar al 100% del ancho disponible
    resize: 'vertical', // Permite ajustar la altura manualmente hasta el límite
    overflowY: 'auto', // Habilita el scroll si el texto es demasiado largo
    [mq('xs', 'min')]: {
        padding: '15px',
    },
}));


export const SendButton = styled('button')(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo del botón a uno más oscuro para mejorar la visibilidad
    color: theme.palette.common.white, // Asegura que el texto sea blanco y contraste bien con el fondo
    padding: '2px 2px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Agrega una sombra para darle más relieve
    transition: 'background-color 0.3s ease', // Suaviza el cambio de color al pasar el cursor

    '&:hover': {
        backgroundColor: theme.palette.primary.light, // Cambia el color cuando se pasa el mouse para darle interactividad
    },

    '&:focus': {
        outline: 'none', // Quita el borde por defecto al enfocar el botón
        backgroundColor: theme.palette.primary.main, // Color cuando el botón está enfocado
    },

    '&:active': {
        backgroundColor: theme.palette.primary.dark, // Color más oscuro al hacer clic
        transform: 'scale(0.98)', // Efecto de clic
    },

    [mq('xs', 'min')]: {
        padding: '2px 2px',
    },
}));
