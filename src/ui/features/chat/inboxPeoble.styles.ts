import { styled } from '@mui/system';
import mq from '../../../config/mq';

interface InboxPeopleContainerProps {
	showUserList: boolean;
	isMobile: boolean;
	isFloating: boolean;
}

export const InboxPeopleContainer = styled('div', {
	shouldForwardProp: (prop) => prop !== 'showUserList' && prop !== 'isMobile' && prop !== 'isFloating',
})<InboxPeopleContainerProps>(({ showUserList, isMobile, isFloating }) => ({
	display: isMobile && !showUserList ? 'none' : 'block',
	width: isFloating
      ? showUserList
        ? '100%' // Ocupa todo el ancho del chat flotante
        : '0'
      : isMobile
      ? showUserList
        ? '100%'
        : '0'
      : '300px',
	overflow: 'hidden',
	transition: 'width 0.3s ease',
	flex: isFloating && showUserList ? 1 : 'none',
	flexDirection: 'column',
	height: '100%',
	overflowY: 'auto',

	// Media queries para diferentes tamaños de pantalla
	//[mq('xs', 'max')]: {
		//width: '100%', // Ocupa toda la pantalla en dispositivos móviles
	//}
	//[mq('md', 'min')]: {
		//width: '30%', // Ocupa solo el 30% en pantallas más grandes
	//},
}));

