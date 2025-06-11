// src/ui/components/platform/Publica.tsx
import React, { useState } from 'react';
import Header from './Header';
import FloatingChat from '../chat/FloatingChat';

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
		</>
	);
};

export default Publica;

