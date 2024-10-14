import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const OutgoingMsgContainer = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
    [mq('sm', 'min')]: {
        marginBottom: '15px',
    },
});

export const SentMsg = styled('div')({
    backgroundColor: '#007bff', // Color azul para los mensajes enviados
    color: '#fff', // Texto blanco para mensajes salientes
    padding: '10px 15px',
    borderRadius: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    [mq('sm', 'min')]: {
        padding: '15px 20px',
        maxWidth: '80%',
    },
});

export const TimeDate = styled('span')({
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#ccc',
    textAlign: 'right',
    [mq('sm', 'min')]: {
        fontSize: '14px',
    },
});

