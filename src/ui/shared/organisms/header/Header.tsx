// src/ui/shared/organisms/header/Header.tsx
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
	Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
	Avatar, Menu, MenuItem, Badge, Snackbar, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';

import Notifications from '../../../features/centerAlert/Notifications';
import { logout } from '../../../../utils/auth/getUserId';

import { HeaderProps } from './header.types';
import { HeaderContainer, NavSection, ActionsSection, Logo, HeaderVariant, HamburgerButton, LeftSlot, } from './header.styles';

import { getMyPermissions } from '../../../../async/services/permissionService';
import { getModuleFromNav, canAccessModule, BYPASS_MODULES, normalizePermList } from '../../permissions/modules';
import getEnvVariables from '../../../../config/configEnvs';
import { fetchMyProfile } from '../../../../async/services/userProfileService';
import type { UserProfile } from '../../../../types/profile';


const Header: React.FC<HeaderProps> = ({
	logoSrc, navLinks, userRole, onLogout,
	onNotificationsClick, onAvatarClick, item,profile,
	variant = 'surface', SearchComponent,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
	const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
	const [deniedMsg, setDeniedMsg] = useState<string | null>(null);
	const { HOST } = getEnvVariables();
	const [fetchedProfile, setFetchedProfile] = useState<UserProfile | null>(null);

	const ref = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const navigate = useNavigate();

	useEffect(() => {
		if (item || profile) return; 
		let alive = true;
		(async () => {
			try {
				const p = await fetchMyProfile();
				if (alive) setFetchedProfile(p ?? null);
			} catch {
				if (alive) setFetchedProfile(null);
			}
		})();
		return () => {
			alive = false;
		};
	}, [item, profile]);

	const DEFAULT_AVATAR = 'https://ptetutorials.com/images/user-profile.png';

	const resolveProfileImg = (host: string, rel?: string): string => {
		const val = rel ?? '';
		if (!val) return DEFAULT_AVATAR;
		if (/^https?:\/\//i.test(val)) return val;
				const h = host.replace(/\/+$/, '');
			const p = val.replace(/^\/+/, '');
		return `${h}/${p}`.replace(/([^:]\/)\/+/g, '$1');
	};

	const effectiveProfilePicture =
		item?.profile?.profilePicture ??
		item?.profilePicture ??
		profile?.profilePicture ??
		fetchedProfile?.profilePicture ??
		'';

	const imgUrl = useMemo<string>(
		() => resolveProfileImg(HOST, effectiveProfilePicture),
		[HOST, effectiveProfilePicture]
	);

	const alt = useMemo(() => {
		const p = profile ?? fetchedProfile;
		if (p) {
			const full = `${p.username ?? ''} ${p.apellidoPaterno ?? ''} ${p.apellidoMaterno ?? ''}`.trim();
			return full || p.username || 'Foto de perfil';
		}
		return item?.username || 'Foto de perfil';
	}, [profile, fetchedProfile, item?.username]);

	const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		(e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
	};

	const [perms, setPerms] = useState<string[] | null>(null);
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const p = await getMyPermissions();
				const normalized = normalizePermList(p);
				if (alive) setPerms(normalized);
				// console.log('[PERMS] raw=', p);
				// console.log('[PERMS] normalized=', normalized);
			} catch {
				if (alive) setPerms([]);
			}
		})();
		return () => { alive = false; };
	}, []);
	/*
	   useEffect(() => {
	   console.group('[Header RBAC]');
	   console.log('perms (server-truth):', perms);
	   if (Array.isArray(navLinks)) {
	   const dump = navLinks.map(({ label, to }: any) => {
	   const mod = getModuleFromNav(to, label);
	   const hasRead = mod ? canAccessModule(perms, mod) : '(sin módulo)';
	   return { label, to, module: mod, canRead: hasRead };
	   });
	   console.table(dump);
	   }
	   console.groupEnd();
	   }, [perms, navLinks]); */

	const showDenied = (msg = 'Módulo bloqueado. Solicita acceso al administrador.') =>
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

	const renderTopNavLink = ({ label, to, icon: Icon, adminOnly }: any) => {
		//  adminOnly: si no es admin, ni aparece
		if (adminOnly && userRole !== 'admi') return null;

		//  RBAC normal
		const moduleName = getModuleFromNav(to, label);
		const skipRBAC = adminOnly || (moduleName && BYPASS_MODULES.has(moduleName));
		const blocked =
			!skipRBAC && moduleName ? !canAccessModule(perms, moduleName) : false;

		if (blocked) return null;

		return (
			<Box key={label} component={RouterLink} to={to}>
				<Icon />
				<Box component="span">{label}</Box>
			</Box>
		);
	};


	const renderDrawerItem = ({ label, to, icon, adminOnly }: any) => {
		if (adminOnly && userRole !== 'admi') return null;

		const moduleName = getModuleFromNav(to, label);
		const skipRBAC = adminOnly || (moduleName && BYPASS_MODULES.has(moduleName));
		const blocked =
			!skipRBAC && moduleName ? !canAccessModule(perms, moduleName) : false;

		if (blocked) return null;

		return (
			<ListItem button key={label} component={RouterLink} to={to} onClick={closeDrawer}>
				<ListItemIcon>{React.createElement(icon)}</ListItemIcon>
				<ListItemText primary={label} />
			</ListItem>
		);
	};

	return (
		<>
			<HeaderContainer variant='surface' ref={ref} className="AppHeader">
				<LeftSlot>
					<HamburgerButton>
						<IconButton edge="start" color="inherit" aria-label="Abrir menú" onClick={toggleDrawer}>
							<MenuIcon />
						</IconButton>
					</HamburgerButton>

					<Box component={RouterLink} to="/plataform">
						<Logo src={logoSrc} alt="Logo" />
					</Box>
				</LeftSlot>

				<NavSection>
					{navLinks.map(renderTopNavLink)}
					{SearchComponent && <Box sx={{ flexGrow: 1, maxWidth: 400 }}>{SearchComponent}</Box>}
				</NavSection>

				<ActionsSection>
					<IconButton color="inherit" aria-label="Ver notificaciones" onClick={(e) => setNotifAnchor(e.currentTarget)}>
						<Badge color="error" variant="dot">
							<NotificationsIcon />
						</Badge>
					</IconButton>

					<IconButton color="inherit" aria-label="Opciones de cuenta" onClick={(e) => setUserAnchor(e.currentTarget)}>
						<Avatar
							sx={{ width: 32, height: 32 }}
							src={imgUrl}      
							alt={alt}
						/>
					</IconButton>

					{onLogout && (
						<IconButton color="inherit" aria-label="Cerrar sesión" onClick={onLogout}>
							<LogoutIcon />
						</IconButton>
					)}
				</ActionsSection>
			</HeaderContainer>

			<Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
				<Box sx={{ mt: 8 }}>
					<List>
						{navLinks
							.filter((link) => !link.adminOnly || userRole === 'admi')
							.map(renderDrawerItem)}
						<ListItem button onClick={logout}>
							<ListItemIcon><LogoutIcon /></ListItemIcon>
							<ListItemText primary="Cerrar sesión" />
						</ListItem>
					</List>
				</Box>
			</Drawer>

			<Menu
				anchorEl={notifAnchor}
				open={Boolean(notifAnchor)}
				onClose={() => setNotifAnchor(null)}
				PaperProps={{ sx: { width: 320 } }}
			>
				<Notifications />
			</Menu>

			<Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}>
				<MenuItem onClick={logout}>
					<LogoutIcon fontSize="small" sx={{ mr: 1 }} />
					Cerrar sesión
				</MenuItem>
			</Menu>

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

