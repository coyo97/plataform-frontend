import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
	Toolbar,
	Box,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Avatar,
	Menu,
	MenuItem,
	Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import Notifications from '../../../features/centerAlert/Notifications'; // 
import { logout } from '../../../../utils/auth/getUserId';

import { HeaderProps } from './header.types';
import { HeaderContainer, NavSection, ActionsSection, Logo, HeaderVariant, HamburgerButton, LeftSlot } from './header.styles';
import mq from '../../../../config/mq';
import SearchComponent from '../../molecules/searchInput';


const Header: React.FC<HeaderProps> = ({
	logoSrc,
	navLinks,
	userRole,
	onLogout,
	onNotificationsClick,
	onAvatarClick, 
	variant='surface',
	SearchComponent,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
	const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth >= 600) setDrawerOpen(false);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const toggleDrawer = () => setDrawerOpen(p => !p);
	const closeDrawer = () => setDrawerOpen(false);

useLayoutEffect(() => {
  if (!ref.current) return;
  const updateVar = () => {
    const h = ref.current?.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };

  updateVar();
  const ro = new ResizeObserver(updateVar);
  ro.observe(ref.current);
  return () => ro.disconnect();
}, []);

	return (
		<>
			<HeaderContainer variant={variant} ref={ref} className="AppHeader">
				{/* IZQUIERDA: Hamburguesa + Logo */}
				<LeftSlot>
					<HamburgerButton>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="Abrir menú"
							onClick={toggleDrawer}
						>
							<MenuIcon />
						</IconButton>
					</HamburgerButton>

					<Box component={RouterLink} to="/plataform">
						<Logo src={logoSrc} alt="Logo" />
					</Box>
				</LeftSlot>

				{/* CENTRO: Links */}
				<NavSection>
					{navLinks
						.map(({ label, to, icon: Icon }) => (
							<Box key={label} component={RouterLink} to={to}>
								<Icon />
								<Box component="span">{label}</Box>
							</Box>
						))}
					{SearchComponent && (
						<Box sx={{ flexGrow: 1, maxWidth: 400 }}>
							{SearchComponent}
						</Box>
					)}
				</NavSection>

				{/* DERECHA: Notificaciones + Avatar + Logout */}
				<ActionsSection>
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

					{onLogout && (
						<IconButton
							color="inherit"
							aria-label="Cerrar sesión"
							onClick={onLogout}
						>
							<LogoutIcon />
						</IconButton>
					)}
				</ActionsSection>
			</HeaderContainer>

			{/* Drawer lateral */}
			<Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
				<Box sx={{ mt: 8 }}>
					<List>
						{navLinks
							.filter(link => !link.adminOnly || userRole === 'admi')
							.map(({ label, to, icon }) => (
								<ListItem button key={label} component={RouterLink} to={to}>
									<ListItemIcon>{React.createElement(icon)}</ListItemIcon>
									<ListItemText primary={label} />
								</ListItem>
							))}
						<ListItem button onClick={logout}>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary="Cerrar sesión" />
						</ListItem>
					</List>
				</Box>
			</Drawer>

			{/* Menú de notificaciones */}
			<Menu
				anchorEl={notifAnchor}
				open={Boolean(notifAnchor)}
				onClose={() => setNotifAnchor(null)}
				PaperProps={{ sx: { width: 320 } }}
			>
				<Notifications />
			</Menu>

			{/* Menú de usuario */}
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

export default Header;

