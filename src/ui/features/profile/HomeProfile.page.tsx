import React, { useState } from 'react';
import { ToggleButton, ContentArea } from './sidebar.styles';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileSidebarMenu from './ProfileSidebarMenu';

import ViewProfilePage from './pages/ViewProfile.page';
import UpdateProfilePage from './pages/UpdateProfile.page';
import FriendRequestsPage from '../friends/pages/FriendRequests.page';
import UserSearchPage from '../friends/pages/UserSearch.page';
import FriendsListPage from '../friends/pages/FriendsList.page';
import BlockedUsersList from '../friends/pages/BlockedUsersList';
import Notifications from '../centerAlert/Notifications';

const HomeProfilePage: React.FC = () => {
	const [selectedSection, setSelectedSection] = useState('viewProfile');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const renderContent = () => {
		switch (selectedSection) {
			case 'updateProfile': return <UpdateProfilePage />;
			case 'viewProfile': return <ViewProfilePage />;
			case 'friendRequests': return <FriendRequestsPage />;
			case 'userSearch': return <UserSearchPage />;
			case 'friendsList': return <FriendsListPage />;
			case 'blockedUsersList': return <BlockedUsersList />;
			case 'notifications': return <Notifications />;
			default: return <ViewProfilePage />;
		}
	};

	return (
		<div style={{ display: 'flex' }}>
			<ToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
				<MenuIcon />
			</ToggleButton>

			<ProfileSidebarMenu
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				onSelect={(section) => {
					setSelectedSection(section);
					setSidebarOpen(false);
				}}
				selectedSection={selectedSection}
			/>

			<ContentArea>{renderContent()}</ContentArea>
		</div>
	);
};

export default HomeProfilePage;

