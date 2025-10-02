// ui/features/profile/HomeProfilePage.tsx
import React, { useState } from 'react';
import { IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

import ProfileSidebarMenu from './ProfileSidebarMenu';

import ViewProfilePage from './pages/ViewProfile.page';
import UpdateProfilePage from './pages/UpdateProfile.page';
import FriendRequestsPage from '../friends/pages/FriendRequests.page';
import UserSearchPage from '../friends/pages/UserSearch.page';
import FriendsListPage from '../friends/pages/FriendsList.page';
import BlockedUsersList from '../friends/pages/BlockedUsersList';
import Notifications from '../centerAlert/Notifications';

import Header from '../../shared/organisms/header/Header';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import { navLinks } from '../../../config/navLinks';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn from '../../shared/atoms/grid/GridColumn';
import { breakPoints } from '../../../config/mq';

const HomeProfilePage: React.FC = () => {
	const [selectedSection, setSelectedSection] = useState('viewProfile');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);

	const renderContent = () => {
		switch (selectedSection) {
			case 'updateProfile':     return <UpdateProfilePage />;
			case 'viewProfile':       return <ViewProfilePage />;
			case 'friendRequests':    return <FriendRequestsPage />;
			case 'userSearch':        return <UserSearchPage />;
			case 'friendsList':       return <FriendsListPage />;
			case 'blockedUsersList':  return <BlockedUsersList />;
			case 'notifications':     return <Notifications />;
			default:                  return <ViewProfilePage />;
		}
	};

	return (
		<>
			<Header
				logoSrc={Logo}
				variant="gradient"
				navLinks={navLinks}
				userRole="student"
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={<SearchOverlay onSearch={(q, cat) => console.log(`Buscar "${q}" en "${cat}"`)} />}
			/>

			<GridContainer
				variant="desktopFluid"
				columns={{ xs: 4, sm: 8, md: 12 }}
				style={{ paddingTop: '88px', minHeight: '100dvh' }}
			>
				<GridColumn
					as="aside"
					span={{ xs: 4, sm: 2, md: 3 }}
					style={{
						position: isMobile ? 'static' : 'sticky',
						top: isMobile ? undefined : 104, // 88 header + margen
						alignSelf: 'start',
						zIndex: 10,
					}}
				>
					<ProfileSidebarMenu
						open={isMobile ? sidebarOpen : true}         // fijo en sm+ ; modal en xs
						onClose={isMobile ? () => setSidebarOpen(false) : undefined}
						onSelect={(section) => {
							setSelectedSection(section);
							if (isMobile) setSidebarOpen(false);
						}}
						selectedSection={selectedSection}
					/>
				</GridColumn>

				{/* Contenido */}
				<GridColumn
					as="main"
					span={{ xs: 4, sm: 6, md: 9 }}
					style={{ minWidth: 0, boxSizing: 'border-box' }}
				>
					{renderContent()}
				</GridColumn>
			</GridContainer>

			{/* Botón flotante  */}
			<IconButton
				onClick={() => setSidebarOpen(true)}
				sx={{
					position: 'fixed',
					bottom: 16,
					left: 16,
					display: { xs: 'flex', sm: 'none' },
				zIndex: 1400,
				bgcolor: 'primary.main',
				color: 'primary.contrastText',
				'&:hover': { bgcolor: 'primary.dark' },
				}}
				aria-label="Abrir menú de perfil"
			>
				<MenuIcon />
			</IconButton>
		</>
	);
};

export default HomeProfilePage;

