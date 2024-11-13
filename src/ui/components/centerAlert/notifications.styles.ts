import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import mq from '../../../config/mq';

export const NotificationContainer = styled('div')(({ theme }: { theme?: Theme }) => ({
  backgroundColor: theme?.palette.background.paper || '#fff',
  color: theme?.palette.text.primary || '#000',
  padding: '10px',
  borderRadius: '4px',
  boxShadow: theme?.shadows[5] || '0 1px 5px rgba(0,0,0,0.3)',
  width: '100%',
  maxWidth: '400px',
  maxHeight: '400px',
  overflowY: 'auto',

  /* Ocultar barra de desplazamiento en navegadores compatibles */
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari y Opera
  },
}));

export const NotificationList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const NotificationItem = styled('li')<{
  isRead: boolean;
}>(({ theme, isRead }) => ({
  padding: '10px',
  marginBottom: '8px',
  borderRadius: '4px',
  backgroundColor: isRead ? theme?.palette.grey[200] || '#f5f5f5' : theme?.palette.action.hover || '#e0e0e0',
  fontWeight: isRead ? 'normal' : 'bold',
  color: theme?.palette.text.primary || '#000',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme?.palette.grey[300] || '#e0e0e0',
  },
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const NotificationMessage = styled('span')({
  flex: 1,
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
  whiteSpace: 'normal',
  marginRight: '10px',
  '@media (max-width: 600px)': {
    marginRight: 0,
    marginBottom: '5px',
  },
});

export const ActionButton = styled('button')(({ theme }: { theme?: Theme }) => ({
  backgroundColor: 'transparent',
  color: theme?.palette.error.main || '#f44336',
  border: 'none',
  padding: '5px',
  cursor: 'pointer',
  flexShrink: 0,
  '&:hover': {
    color: theme?.palette.error.dark || '#d32f2f',
  },
}));

