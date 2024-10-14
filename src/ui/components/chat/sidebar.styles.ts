import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const SidebarContainer = styled('div')({
  width: '100%',
  padding: '10px',
  backgroundColor: '#f8f8f8',
  borderRight: '1px solid #ddd',
  [mq('xs', 'min')]: {
    width: '100%', // Ocupa toda la pantalla en dispositivos móviles
  },
  [mq('md', 'min')]: {
    width: '300px', // Ancho fijo para pantallas más grandes
  },
});

export const SectionTitle = styled('h5')({
  margin: '10px 0',
  fontSize: '18px',
  color: '#333',
});

