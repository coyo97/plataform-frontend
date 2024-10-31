
import UpdateProfile from './UpdateProfile';
import ViewProfile from './ViewProfile';
import FriendRequests from '../friends/FriendRequests';
import UserSearch from '../friends/UserSearch';
import FriendsList from '../friends/FriendsList';
import { Sidebar, SidebarContent } from '../plaform/sidebar.styles';
import Notifications from '../centerAlert/Notifications';
import { useState } from 'react';
import AdminNotifications from '../centerAlert/AdminNotifications';


const HomeProfile: React.FC = () => {

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const userRole = localStorage.getItem('role'); // Verificar el rol del usuario


	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return(
		<>
			<UpdateProfile/>
			<ViewProfile/>
			<Sidebar isOpen={isSidebarOpen}>
				<SidebarContent>
					<h3>Notificaciones</h3>
					{/* Mostrar notificaciones */}
					<Notifications />
					{/* Mostrar la opción de enviar notificaciones si el usuario es admin */}
					{userRole === 'admin' && <AdminNotifications />}
					<button onClick={toggleSidebar}>Cerrar</button>
				</SidebarContent>
			</Sidebar>
			<button onClick={toggleSidebar}>Abrir Notificaciones</button>

			<FriendRequests/>
			<UserSearch/>
			<FriendsList/>
		</>
	);
}
export default HomeProfile;
