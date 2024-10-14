import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const InboxPeopleContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    maxHeight: '100vh', // Para asegurar que los usuarios se mantengan visibles
    overflowY: 'auto',
    [mq('xs', 'max')]: {
        width: '100%', // Ocupa toda la pantalla en dispositivos móviles
    },
    [mq('md', 'min')]: {
        width: '30%', // Ocupa solo el 30% en pantallas más grandes
    },
})
