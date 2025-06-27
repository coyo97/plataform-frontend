
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
	AppBar,
	Toolbar,
	Box,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Avatar,
	Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import StreamIcon from '@mui/icons-material/LiveTv';
import ArticleIcon from '@mui/icons-material/Article';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';

import { colors } from '../../../Theme/tokens/colors';
import Notifications from '../centerAlert/Notifications';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { logout, getUserRole } from '../../../utils/auth/getUserId';

import mq from '../../../config/mq';   // ← media-query personalizado

/* ─ Links de navegación ─ */
const navLinks = [
	{ label: 'Estudiante',     to: '/profile',        icon: <SchoolIcon /> },
	{ label: 'Material',       to: '/material-user',  icon: <ArticleIcon /> },
	{ label: 'Mensajería',     to: '/message',        icon: <ChatIcon/> },
	{ label: 'Stream',         to: '/stream-academi', icon: <StreamIcon /> },
	{ label: 'Publicaciones',  to: '/publications',   icon: <ArticleIcon /> },
	{ label: 'Ayuda Académica',to: '/academic-help',  icon: <HelpIcon /> },
];

const Header: React.FC = () => {
	const [drawerOpen,  setDrawerOpen]  = useState(false);
	const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
	const [userAnchor,  setUserAnchor]  = useState<null | HTMLElement>(null);

	/* Cerrar drawer al ensanchar pantalla ≥ 600 px */
	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth >= 600) setDrawerOpen(false);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const toggleDrawer = () => setDrawerOpen(p => !p);
	const closeDrawer  = () => setDrawerOpen(false);

	const userRole = getUserRole();

	return (
		<>
			{/* ══════════════ APPBAR (oculto < 600 px) ══════════════ */}
			<AppBar
				position="fixed"
				sx={{
					backgroundColor: colors.brand.primary[600],
					zIndex: theme => theme.zIndex.drawer + 1,
					[mq('xs', 'max')]: { display: 'none' }, // ocultar en xs y xxs
				}}
			>
				<Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
					{/* Logo + links */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box component={RouterLink} to="/plataform">
							<img src={Logo} alt="Logo UATF" style={{ height: 36 }} />
						</Box>

						{/* Administrador */}
						{userRole === 'admi' && (
							<Box component={RouterLink} to="/administrator" sx={adminLinkStyle}>
								<AdminPanelSettingsIcon />
								<Box component="span" sx={labelVisibility}>
									Administrador
								</Box>
							</Box>
						)}

						{/* Links iterados */}
						{navLinks.map(({ label, to, icon }) => (
							<Box key={label} component={RouterLink} to={to} sx={navLinkStyle}>
								{icon}
								<Box component="span" sx={labelVisibility}>
									{label}
								</Box>
							</Box>
						))}
					</Box>

					{/* Notificaciones + avatar */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<IconButton
							color="inherit"
							aria-label="Ver notificaciones"
							onClick={e => setNotifAnchor(e.currentTarget)}
						>
							<Badge color="error" variant="dot">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<IconButton
							color="inherit"
							aria-label="Opciones de cuenta"
							onClick={e => setUserAnchor(e.currentTarget)}
						>
							<Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* ══════════════ HAMBURGUESA (solo < 600 px) ══════════════ */}
			<Box
				sx={{
					position: 'fixed',
					top: 8,
					left: 8,
					zIndex: theme => theme.zIndex.drawer + 2,
					display: 'none',
					[mq('xs', 'max')]: { display: 'flex' },   // mostrar en xs y xxs
				}}
			>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="Abrir menú"
					onClick={toggleDrawer}
					sx={{
						backgroundColor: colors.brand.primary[600],
						'&:hover': { backgroundColor: colors.brand.primary[700] },
					color: 'white',
					}}
				>
					<MenuIcon />
				</IconButton>
			</Box>

			{/* ══════════════ DRAWER (para todas las vistas) ══════════════ */}
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={closeDrawer}
				sx={{ '& .MuiDrawer-paper': { width: 240 } }}
			>
				<Box role="presentation" onClick={closeDrawer} sx={{ mt: 8 }}>
					<List>
						{userRole === 'admi' && (
							<ListItem button component={RouterLink} to="/administrator" onClick={closeDrawer}>
								<ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
								<ListItemText primary="Administrador" />
							</ListItem>
						)}
						{navLinks.map(({ label, to, icon }) => (
							<ListItem button key={label} component={RouterLink} to={to} onClick={closeDrawer}>
								<ListItemIcon>{icon}</ListItemIcon>
								<ListItemText primary={label} />
							</ListItem>
						))}
						<ListItem button onClick={() => { closeDrawer(); logout(); }}>
							<ListItemIcon><LogoutIcon /></ListItemIcon>
							<ListItemText primary="Cerrar sesión" />
						</ListItem>
					</List>
				</Box>
			</Drawer>

			{/* ══════════════ MENÚS (solo abren en desktop) ══════════════ */}
			<Menu
				anchorEl={notifAnchor}
				open={Boolean(notifAnchor)}
				onClose={() => setNotifAnchor(null)}
				PaperProps={{ sx: { width: 320 } }}
			>
				<Notifications />
			</Menu>

			<Menu
				anchorEl={userAnchor}
				open={Boolean(userAnchor)}
				onClose={() => setUserAnchor(null)}
			>
				<MenuItem onClick={logout}>
					<LogoutIcon fontSize="small" sx={{ mr: 1 }} />
					Cerrar sesión
				</MenuItem>
			</Menu>
		</>
	);
};

/* ─ Estilos de links ─ */
const baseLinkStyle = {
	display: 'flex',
	alignItems: 'center',
	textDecoration: 'none',
	fontWeight: 500,
	padding: '6px 10px',
	borderRadius: 6,
	transition: 'background 0.2s ease-in-out',
	color: colors.neutral.white[900],
	'&:hover': {
		backgroundColor: colors.brand.primary[700],
		textDecoration: 'none',
	},
};

const navLinkStyle   = { ...baseLinkStyle, gap: 0.5 };
const adminLinkStyle = { ...baseLinkStyle, gap: 0.5 };

/* Mostrar / ocultar texto debajo de 900 px */
const labelVisibility = {
	ml: 1,
	[mq('sm', 'max')]: { display: 'none' }, // 600-899 px → ocultar texto
	[mq('md', 'min')]: { display: 'inline' },
};

export default Header;

