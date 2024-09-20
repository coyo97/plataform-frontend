import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import mq from '../../config/mq';

const MessagingContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.background.default,
    [mq('sm', 'min')]: {
        padding: '20px',
    },
}));

const InboxMsg = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    overflow: 'hidden',
});

// Estilos para los mensajes entrantes
export const IncomingMessageStyle = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[200],
  padding: '10px',
  borderRadius: '10px',
  marginBottom: '10px',
  maxWidth: '70%',
}));

// Estilos para los mensajes salientes
export const OutgoingMessageStyle = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  backgroundColor: theme.palette.primary.light,
  padding: '10px',
  borderRadius: '10px',
  marginBottom: '10px',
  color: theme.palette.primary.contrastText,
  maxWidth: '70%',
}));

// Estilos para el formulario de envío de mensajes
export const SendMessageForm = styled('form')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  [mq('xs', 'max')]: {
    padding: '8px',
  },
}));

// Estilos para el campo de entrada de texto
export const WriteMsg = styled('input')(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  padding: '10px',
  borderRadius: '4px',
  border: `1px solid ${theme.palette.grey[300]}`,
  marginRight: '10px',
  fontFamily: 'Inter-Regular',
  [mq('xs', 'max')]: {
    padding: '8px',
  },
}));

// Estilos para el botón de enviar mensaje
export const MsgSendBtn = styled('button')(({ theme }: { theme: Theme }) => ({
  padding: '10px 20px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontFamily: 'Inter-Regular',
  [mq('xs', 'max')]: {
    padding: '8px 16px',
  },
}));

