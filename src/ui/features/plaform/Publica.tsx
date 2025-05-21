// src/ui/components/platform/Publica.tsx
import React, { useState } from 'react';
import Header from './Header';
import FloatingChat from '../chat/FloatingChat';
import Notifications from '../centerAlert/Notifications';
import AdminNotifications from '../centerAlert/AdminNotifications';
import { Sidebar, SidebarContent } from './sidebar.styles';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
import ViewPublicationsPage from '../publications/pages/publications/ViewPublications.page';

const Publica: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('role') || 'user'; // Asigna un rol por defecto si es null

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log('Sidebar abierto:', !isSidebarOpen);
  };

  return (
    <>
      <Header/>
      <FloatingChat/>
      {/* Botón para abrir el Sidebar *
      <button onClick={toggleSidebar}>Abrir Notificaciones</button>
      {/* Sidebar
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarContent>
          <h3>Notificaciones</h3>
          {/* Mostrar notificaciones
          <Notifications />
          {/* Mostrar la opción de enviar notificaciones si el usuario es admin
          {userRole === 'admin' && <AdminNotifications />}
          <button onClick={toggleSidebar}>Cerrar</button>
        </SidebarContent>
      </Sidebar>
		*/}
		<div>
			<ViewPublicationsPage/>
		</div>
    </>
  );
};

export default Publica;

