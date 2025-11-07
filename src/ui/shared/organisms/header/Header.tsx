// src/ui/shared/organisms/header/Header.tsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
	Snackbar,
	Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';

import Notifications from '../../../features/centerAlert/Notifications';
import { logout } from '../../../../utils/auth/getUserId';

import { HeaderProps } from './header.types';
import {
	HeaderContainer,
	NavSection,
	ActionsSection,
	Logo,
	HeaderVariant,
	HamburgerButton,
	LeftSlot,
} from './header.styles';
import mq from '../../../../config/mq';

// 🔐 permisos server-truth
import { getMyPermissions } from '../../../../async/services/permissionService';

const Header: React.FC<HeaderProps> = ({
	logoSrc,
	navLinks,
	userRole,
	onLogout,
	onNotificationsClick,
	onAvatarClick,
	variant = 'surface',
	SearchComponent,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
	const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
	const ref = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const navigate = useNavigate();

	// ===== permisos (verdad del servidor) =====
	const [perms, setPerms] = useState<string[] | null>(null);
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const p = await getMyPermissions();
				if (alive) setPerms(p);
			} catch {
				if (alive) setPerms([]);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);

	// Helper permiso
	const has = (m: string, a: string) => (perms ?? []).includes(`${m}:${a}`.toLowerCase());
	// Política para “acceso al módulo Perfil”: al menos poder leer
	const canAccessProfile = has('profile', 'read'); // o usa OR con create/update/delete si quieres

	// Mensaje cuando está bloqueado pero el usuario hace clic
	const [deniedMsg, setDeniedMsg] = useState<string | null>(null);
	const showDenied = (msg = 'No tienes acceso a este módulo. Solicita permisos al administrador.') =>
		setDeniedMsg(msg);

	const toggleDrawer = () => setDrawerOpen((p) => !p);
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

	// Identificar si un link es de “Perfil”
	const isProfileLink = (to: string, label?: string) => {
		const t = (to || '').toLowerCase();
		const l = (label || '').toLowerCase();
		return t.startsWith('/profile') || l.includes('perfil');
	};

	// Render de un link del header con bloqueo visual+funcional si es Perfil sin permiso
	const renderTopNavLink = ({ label, to, icon: Icon, adminOnly }: any) => {
		const blocked = isProfileLink(to, label) && !canAccessProfile;
		if (adminOnly && userRole !== 'admi') return null;

		if (blocked) {
			return (
				<Tooltip key={label} title="Módulo bloqueado. Solicita acceso.">
					<Box
						sx={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 1,
							px: 1,
							py: 0.5,
							opacity: 0.5,
							cursor: 'not-allowed',
							userSelect: 'none',
						}}
						onClick={() => showDenied()}
					>
						<Icon />
						<Box component="span">{label}</Box>
					</Box>
				</Tooltip>
			);
		}

		return (
			<Box key={label} component={RouterLink} to={to}>
				<Icon />
				<Box component="span">{label}</Box>
			</Box>
		);
	};

	// Render de un item del drawer con bloqueo (opaco + click muestra aviso)
	const renderDrawerItem = ({ label, to, icon }: any) => {
		const blocked = isProfileLink(to, label) && !canAccessProfile;

		if (blocked) {
			return (
				<Tooltip key={label} title="Módulo bloqueado. Solicita acceso.">
					<ListItem
						button
						onClick={() => showDenied()}
						sx={{
							opacity: 0.5,
							cursor: 'not-allowed',
							'& .MuiListItemIcon-root, & .MuiListItemText-root': {
								color: 'text.disabled',
						},
						}}
					>
						<ListItemIcon>{React.createElement(icon)}</ListItemIcon>
						<ListItemText primary={label} />
					</ListItem>
				</Tooltip>
			);
		}

		return (
			<ListItem button key={label} component={RouterLink} to={to} onClick={closeDrawer}>
				<ListItemIcon>{React.createElement(icon)}</ListItemIcon>
				<ListItemText primary={label} />
			</ListItem>
		);
	};

	return (
		<>
			<HeaderContainer variant={variant as HeaderVariant} ref={ref} className="AppHeader">
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
					{navLinks.map(renderTopNavLink)}
					{SearchComponent && <Box sx={{ flexGrow: 1, maxWidth: 400 }}>{SearchComponent}</Box>}
				</NavSection>

				{/* DERECHA: Notificaciones + Avatar + Logout */}
				<ActionsSection>
					<IconButton
						color="inherit"
						aria-label="Ver notificaciones"
						onClick={(e) => setNotifAnchor(e.currentTarget)}
					>
						<Badge color="error" variant="dot">
							<NotificationsIcon />
						</Badge>
					</IconButton>

					<IconButton
						color="inherit"
						aria-label="Opciones de cuenta"
						onClick={(e) => setUserAnchor(e.currentTarget)}
					>
						<Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
					</IconButton>

					{onLogout && (
						<IconButton color="inherit" aria-label="Cerrar sesión" onClick={onLogout}>
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
							.filter((link) => !link.adminOnly || userRole === 'admi')
							.map(renderDrawerItem)}
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
			<Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}>
				{/* Si quieres, aquí también puedes poner “Perfil”: si no hay permiso, lo muestras opaco */}
				{/* <MenuItem .../> */}
				<MenuItem onClick={logout}>
					<LogoutIcon fontSize="small" sx={{ mr: 1 }} />
					Cerrar sesión
				</MenuItem>
			</Menu>

			{/* Aviso al intentar entrar a un módulo bloqueado */}
			<Snackbar
				open={!!deniedMsg}
				autoHideDuration={3500}
				onClose={() => setDeniedMsg(null)}
				message={deniedMsg ?? ''}
			/>
		</>
	);
};

export default Header;

