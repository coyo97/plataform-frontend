// src/ui/components/platform/Publica.tsx
import React from 'react';
import CareerManager from '../careers/CareerManager';
import Chat from '../chat/Chat';
import Header from './Header';
import GroupManager from '../groups/GroupManager';
import Stream from '../stream/Stream';
import JoinStream from '../JoinStream';
import FloatingChat from '../chat/FloatingChat';
import Notifications from '../notifications/Notifications';
import AdminNotifications from '../notifications/AdminNotifications';
import { useState } from 'react';
import { Sidebar, SidebarContent } from './sidebar.styles';
import { ToggleButton, ArrowIcon } from './header.styles';

const Publica: React.FC = () => {
	const userId = '12345'; // Obtén el userId de la fuente correcta, como estado o props
	const streamId = 'stream123'; // También lo puedes obtener dinámicamente

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const userRole = localStorage.getItem('role'); // Verificar el rol del usuario


	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	return (
		<>
			<Header/>
			<Stream userId={userId} streamId={streamId} />
			<JoinStream/>
			<FloatingChat/>
			{/* Sidebar */}
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

			{/* Botón para abrir el Sidebar */}
			<button onClick={toggleSidebar}>Abrir Notificaciones</button>

		</>
	);
};

export default Publica;

