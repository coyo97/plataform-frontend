// ui/features/plaform/Header.tsx
import React, { useState, useEffect} from 'react';
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

import { colors } from '../../../Theme/tokens/colors';
import Notifications from '../centerAlert/Notifications';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { logout, getUserRole } from '../../../utils/auth/getUserId';

const navLinks = [
	{ label: 'Estudiante', to: '/profile', icon: <SchoolIcon /> },
	{ label: 'Material', to: '/material-user', icon: <ArticleIcon /> },
	{ label: 'Mensajería', to: '/message', icon: <SearchIcon /> },
	{ label: 'Stream', to: '/stream-academi', icon: <StreamIcon /> },
	{ label: 'Publicaciones', to: '/publications', icon: <ArticleIcon /> },
	{ label: 'Ayuda Académica', to: '/academic-help', icon: <HelpIcon /> },
];

const Header: React.FC = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
	const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth >= 600) setDrawerOpen(false);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const toggleDrawer = () => setDrawerOpen(prev => !prev);      // A
	const closeDrawer  = () => setDrawerOpen(false);


	const userRole = getUserRole();


	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					backgroundColor: colors.brand.primary[600],
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar sx={{ gap: 2 }}>
					{/* Menú hamburguesa (mobile) */}
					<IconButton
						edge="start"
						color="inherit"
						aria-label="Menú"
						sx={{ display: { sm: 'none' } }}
						onClick={toggleDrawer}
					>
						<MenuIcon />
					</IconButton>

					{/* Logo */}
					<Box component={RouterLink} to="/plataform" sx={{ display: 'flex', alignItems: 'center' }}>
						<img src={Logo} alt="Logo UATF" style={{ height: 36 }} />
					</Box>

					{/* Links desktop */}
					<Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 3, gap: 2 }}>
						{userRole === 'admi' && (
							<Box component={RouterLink} to="/administrator" sx={linkStyle}>
								Administrador
							</Box>
						)}
						{navLinks.map(({ label, to, icon }) => (
							<Box key={label} component={RouterLink} to={to} sx={linkStyle}>
								{icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
								{label}
							</Box>
						))}
					</Box>

					{/* Empuja a la derecha */}
					<Box sx={{ ml:'auto', display:'flex', alignItems:'center', gap:1 }}>
						{/* Botón notificaciones */}
						<IconButton
							color="inherit"
							onClick={(e) => setNotifAnchor(e.currentTarget)}
						>
							<Badge color="error" variant="dot">
								<NotificationsIcon />
							</Badge>
						</IconButton>

						{/* Avatar + logout */}
						<IconButton color="inherit" onClick={(e) => setUserAnchor(e.currentTarget)}>
							<Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* Drawer móvil */}
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

			{/* Popover de notificaciones */}
			<Menu
				anchorEl={notifAnchor}
				open={Boolean(notifAnchor)}
				onClose={() => setNotifAnchor(null)}
				PaperProps={{ sx: { width: 320 } }}
			>
				<Notifications />
			</Menu>

			{/* Menú usuario / logout */}
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

const linkStyle = {
	display: 'flex',
	alignItems: 'center',
	color: colors.neutral.white[900],
	textDecoration: 'none',
	fontWeight: 500,
	padding: '6px 10px',
	borderRadius: 6,
	transition: 'background 0.2s ease-in-out',
	'&:hover': {
		backgroundColor: colors.brand.primary[700],
		textDecoration: 'none',
	},
};


export default Header;

