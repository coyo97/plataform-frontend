// src/ui/components/platform/Publica.tsx
import React from 'react';
import FloatingChat from '../chat/FloatingChat';
import StreamPreviewPanel from './sections/StreamPreviewPanel';
import { Box } from '@mui/material';
import AcademicHelpTabbedPanel from './sections/AcademicHelpTabbedPanel';
import TopPostsPanel from './sections/TopPostsPanel';
import NewMessagesPanel from './sections/NewMessagesPanel';
import FriendRequestsPanel from './sections/FriendRequestsPanel';
import mq from '../../../config/mq'; // media-query personalizado
//import Header from './Header';

import Header from '../../shared/organisms/header/Header';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { NavLink, navLinks } from '../../../config/navLinks';
import SearchInput from '../../shared/molecules/searchInput';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';


const Publica: React.FC = () => {
	return (
		<>
			<Header
				logoSrc={Logo}
				variant='gradient'
				navLinks={navLinks}
				userRole="student" // o "admi" dinámico según login
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={
					<SearchOverlay
						onSearch={(q, cat) =>
							console.log(`Buscar "${q}" en categoría "${cat}"`)
						}
					/>
				}
			/>
			<Box sx={{ ...theme => theme.mixins.toolbar }} />
			<FloatingChat />

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xxs: 'column', sm: 'row' }, 
				gap: { xxs: 2, xs: 3, md: 4 },
				mt: { xxs: 2, xs: 4 },
				px: { xxs: 1, xs: 2 },
				width: '100%',
				overflowX: 'hidden',
				pt: { xs: '56px', sm: '64px' },
				}}
			>
				{/* Columna izquierda (streams + ayuda académica) */}
				<Box
					sx={{
						flex: { sm: 2 },
					display: 'flex',
					flexDirection: 'column',
					gap: { xxs: 2, xs: 3, md: 4 },
					width: '100%',
					minWidth: 0,
					}}
				>
					<StreamPreviewPanel />
					<AcademicHelpTabbedPanel />
				</Box>

				{/* Columna derecha (posts + mensajes + solicitudes) */}
				<Box
					sx={{
						flex: { sm: 2 },
					display: 'flex',
					flexDirection: 'column',
					gap: { xxs: 2, xs: 3, md: 4 },
					width: '100%',
					minWidth: 0,
					}}
				>
					<TopPostsPanel />
					<NewMessagesPanel />
					<FriendRequestsPanel />
				</Box>
			</Box>
		</>
	);
};

export default Publica;

