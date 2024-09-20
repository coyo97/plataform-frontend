import { styled } from '@mui/system';
import { Box, Button, Input } from '@mui/material';

// Contenedor Principal del Chat
export const MessagingContainer = styled(Box)({
    display: 'flex',
    height: '80vh',
    border: '1px solid #ddd',
});

// Contenedor del Panel de Mensajes
export const InboxMsg = styled(Box)({
    display: 'flex',
    width: '100%',
});

// Panel de Personas en el Inbox
export const InboxPeople = styled(Box)({
    flex: '0 0 30%',
    borderRight: '1px solid #ddd',
    overflowY: 'auto',
    padding: '15px',
    '& img': {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginBottom: '10px',
    },
});

// Contenedor de la Historia de Mensajes
export const MsgHistory = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    maxHeight: 'calc(100% - 60px)', // Ajuste para dejar espacio para la entrada de mensajes
});

// Contenedor para Selección de Chat
export const MiddleScreen = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
});

// Estilos para Alertas Informativas
export const AlertInfo = styled(Box)({
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #d1ecf1',
    borderRadius: '4px',
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
});

// Botón de Envío de Mensajes
export const MsgSendBtn = styled(Button)({
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    marginLeft: '5px',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
});

// Área de Escritura de Mensajes
export const TypeMsg = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderTop: '1px solid #ddd',
});
export const WriteMsg = styled(Input)({
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
    resize: 'none',  // Para desactivar el cambio de tamaño manual si usas textarea
    overflowX: 'auto', // Habilita desplazamiento horizontal si es necesario
    overflowY: 'hidden', // Evita desplazamiento vertical
});

