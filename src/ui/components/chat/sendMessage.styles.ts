import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const FormContainer = styled('form')({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderTop: '1px solid #ddd',
    [mq('sm', 'min')]: {
        padding: '15px',
    },
    position: 'relative',  // Asegura que no haya problemas de posicionamiento
    width: '100%',  // Asegura que el formulario ocupe todo el ancho
});


export const InputMsgWrite = styled('input')({
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    [mq('sm', 'min')]: {
        padding: '15px',
        fontSize: '18px',
    },
    '&::placeholder': {
        color: '#999',
    },
});

export const MsgSendBtn = styled('button')({
    backgroundColor: '#007bff',  // Color de fondo
    color: '#fff',  // Color del texto
    border: 'none',  // Sin bordes por defecto
    borderRadius: '5px',  // Bordes redondeados
    padding: '10px 15px',  // Aseguramos suficiente padding
    cursor: 'pointer',  // Cambia el cursor al pasar sobre el botón
    width: '100%',  // Ajustamos el ancho al 100% para asegurar que se vea
    [mq('sm', 'min')]: {
        padding: '12px 20px',
        fontSize: '16px',
    },
    '&:hover': {
        backgroundColor: '#0056b3',  // Cambia de color al hacer hover
    },
    '&:focus': {
        outline: 'none',  // Eliminamos el borde de enfoque predeterminado
    },
    '&:active': {
        transform: 'scale(0.98)',  // Efecto al hacer clic
    },
});

