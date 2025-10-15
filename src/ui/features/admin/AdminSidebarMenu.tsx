// src/ui/features/admin/AdminSidebarMenu.tsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery, Fab } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import Sidebar from '../../shared/organisms/sidebar/Sidebar';
import Text from '../../shared/atoms/typography/Text';
import TextItemRow from '../../shared/molecules/items/TextItemRow';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import FolderIcon from '@mui/icons-material/Folder';

import EscudoUATF from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import Header from '../../shared/organisms/header/Header';
import { navLinks } from '../../../config/navLinks';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import { userHasAdminRole } from '../../../utils/auth/getUserId';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

type Props = {
	open: boolean;         // usado para desktop/tablet
	onClose?: () => void;
};

const items = [
	{ to: '/administrator', icon: <DashboardIcon/>, label: 'Dashboard' },
	{ to: '/administrator/users', icon: <PeopleIcon/>, label: 'Gestión de Usuarios' },
	{ to: '/administrator/roles', icon: <AssignmentIndIcon/>, label: 'Gestión de Roles' },
	{ to: '/administrator/moderator', icon: <SecurityIcon/>, label: 'Moderador IA' },
	{ to: '/administrator/center-alert', icon: <NotificationsIcon/>, label: 'Centro de alertas' },
	{ to: '/administrator/career', icon: <SchoolIcon/>, label: 'Carreras' },
	{ to: '/administrator/conf-file', icon: <FolderIcon/>, label: 'Configuración Archivos' },
];

const AdminSidebarMenu: React.FC<Props> = ({ open, onClose }) => {
	const hasAdmin = userHasAdminRole();
	const visibleLinks = useMemo(
		() => navLinks.filter((l) => !l.adminOnly || hasAdmin),
		[hasAdmin]
	);

	// --- Responsive: móvil = hamburguesa inferior izquierda
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen((v) => !v);
	const handleClose = () => {
		setMobileOpen(false);
		onClose?.();
	};

	// En mobile controlamos con estado local; en desktop respetamos "open" externo
	const computedOpen = isMobile ? mobileOpen : open;

	return (
		<>
			<Header
				logoSrc={Logo}
				variant="gradient"
				navLinks={visibleLinks}
				userRole={hasAdmin ? 'admi' : 'student'}
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={
					<SearchOverlay
						onSearch={(q, cat) => console.log(`Buscar "${q}" en categoría "${cat}"`)}
					/>
				}
			/>

			{/* Botón hamburguesa fijo SOLO en móvil */}
			{isMobile && (
				<Fab
					onClick={toggleMobile}
					aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
					sx={{
						position: 'fixed',
						left: 16,
						bottom: 16,
						zIndex: (t) => t.zIndex.drawer + 2,
						boxShadow: 3,
					}}
					size="medium"
				>
					{mobileOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
				</Fab>
			)}

			{/* DESKTOP/TABLET: sidebar sticky controlado por prop `open` */}
			{!isMobile && (
				<Sidebar
					open={open}
					onClose={onClose}
					variant="primary"
					width={250}
					position="left"
					sticky
					header={<Text as="h2" size="md" weight="bold">Admin Panel</Text>}
					footer={
						<div style={{ textAlign: 'center', padding: '1rem 0' }}>
							<img
								src={EscudoUATF}
								alt="Logo Universidad Autónoma Tomás Frías"
								style={{ width: '50px', marginBottom: '0.5rem' }}
							/>
							<div style={{ fontSize: '0.75rem' }}>
								&copy;2025 Universidad Autónoma Tomás Frías
							</div>
						</div>
		}
				>
					{items.map((it) => (
						<Link key={it.to} to={it.to} style={{ textDecoration: 'none', textAlign:'left' }}>
							<TextItemRow
								icon={it.icon}
								label={<Text as="span" size="sm" colorKey="sidebar.text">{it.label}</Text>}
							/>
						</Link>
					))}
				</Sidebar>
			)}

			{/* MÓVIL: se monta SOLO cuando está abierto */}
			{isMobile && mobileOpen && (
				<Sidebar
					open
					onClose={handleClose}
					variant="primary"       // si tu Sidebar tiene "temporary"/"overlay", úsalo aquí
					width={250}
					position="left"
					sticky={false}
					header={<Text as="h2" size="md" weight="bold">Admin Panel</Text>}
					footer={
						<div style={{ textAlign: 'center', padding: '1rem 0' }}>
							<img
								src={EscudoUATF}
								alt="Logo Universidad Autónoma Tomás Frías"
								style={{ width: '50px', marginBottom: '0.5rem' }}
							/>
							<div style={{ fontSize: '0.75rem' }}>
								&copy;2025 Universidad Autónoma Tomás Frías
							</div>
						</div>
					}
				>
					{items.map((it) => (
						<Link
							key={it.to}
							to={it.to}
							style={{ textDecoration: 'none' }}
							onClick={handleClose}   // cerrar al navegar en móvil
						>
							<TextItemRow
								icon={it.icon}
								label={<Text as="span" size="sm" colorKey="sidebar.text">{it.label}</Text>}
							/>
						</Link>
					))}
				</Sidebar>
			)}
		</>
	);

};

export default AdminSidebarMenu;

