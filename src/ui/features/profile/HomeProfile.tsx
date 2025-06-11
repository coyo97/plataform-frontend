import React, { useState } from 'react';
import ViewProfile from './ViewProfile';
import BlockedUsersList from '../friends/pages/BlockedUsersList';
import Notifications from '../centerAlert/Notifications';
import { SidebarContainer, SidebarLink, ContentArea, ToggleButton } from './sidebar.styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import ViewProfilePage from './pages/ViewProfile.page';
import UpdateProfilePage from './pages/UpdateProfile.page';
import FriendRequestsPage from '../friends/pages/FriendRequests.page';
import UserSearchPage from '../friends/pages/UserSearch.page';
import FriendsListPage from '../friends/pages/FriendsList.page';

const HomeProfile: React.FC = () => {
	const [selectedSection, setSelectedSection] = useState('viewProfile');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const renderContent = () => {
		switch (selectedSection) {
			case 'updateProfile':
				return <UpdateProfilePage/>;
			case 'viewProfile':
				return <ViewProfilePage />;
			case 'friendRequests':
			return <FriendRequestsPage/>;
			case 'userSearch':
				return <UserSearchPage/>;
			case 'friendsList':
				return <FriendsListPage/>;
			case 'blockedUsersList':
				return <BlockedUsersList/>;
			case 'notifications':
				return <Notifications />;
			default:
				return <ViewProfile />;
		}
	};

	const handleSectionChange = (section: string) => {
		setSelectedSection(section);
		setSidebarOpen(false); // Cerrar el sidebar en móvil después de seleccionar una sección
	};

	return (
		<div style={{ display: 'flex' }}>
			{/* Botón para togglear el sidebar en móvil */}
			<ToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
				<MenuIcon />
			</ToggleButton>

			{/* Sidebar */}
			<SidebarContainer open={sidebarOpen}>
				<SidebarLink onClick={() => handleSectionChange('viewProfile')}>Ver Perfil</SidebarLink>
				<SidebarLink onClick={() => handleSectionChange('updateProfile')}>Actualizar Perfil</SidebarLink>
				<SidebarLink onClick={() => handleSectionChange('friendRequests')}>Solicitudes de Amistad</SidebarLink>
				<SidebarLink onClick={() => handleSectionChange('userSearch')}>Buscar Usuarios</SidebarLink>
				<SidebarLink onClick={() => handleSectionChange('friendsList')}>Lista de Amigos</SidebarLink>
				<SidebarLink onClick={() => handleSectionChange('blockedUsersList')}>Usuarios Bloqueados</SidebarLink>
				<SidebarLink onClick={() => handleSectionChange('notifications')}>Notificaciones</SidebarLink>
			</SidebarContainer>

			{/* Content Area */}
			<ContentArea>
				{renderContent()}
			</ContentArea>
		</div>
	);
};

export default HomeProfile;

