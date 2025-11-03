// ui/features/profile/HomeProfile.page.tsx
import React, { useEffect, useState } from 'react';
import { IconButton, useMediaQuery, Paper } from '@mui/material';
import { breakPoints } from '../../../config/mq';

import ProfileSidebarMenu from './ProfileSidebarMenu';
import ViewProfilePage from './pages/ViewProfile.page';
import UpdateProfilePage from './pages/UpdateProfile.page';
import Header from '../../shared/organisms/header/Header';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import { navLinks } from '../../../config/navLinks';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn from '../../shared/atoms/grid/GridColumn';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSearchParams } from 'react-router-dom';
import { userHasAdminRole } from '../../../utils/auth/getUserId';

// permisos desde el servidor
import { getMyPermissions } from '../../../async/services/permissionService';

const HomeProfilePage: React.FC = () => {
	const [selectedSection, setSelectedSection] = useState('viewProfile');
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [params, setParams] = useSearchParams();

	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);

	// ===== Obtener permisos efectivos del usuario (verdad del servidor) =====
	const [serverPerms, setServerPerms] = useState<string[] | null>(null);
	const [loadingPerms, setLoadingPerms] = useState<boolean>(true);

	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const perms = await getMyPermissions();
				if (alive) setServerPerms(perms);
			} catch {
				if (alive) setServerPerms([]);
			} finally {
				if (alive) setLoadingPerms(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);

	// ===== Calcular permiso “profile:update” =====
	const canEditProfile = !loadingPerms && !!serverPerms?.includes('profile:update');

	// Si ya puede editar, limpia flag persistente de 403 y notifica
	useEffect(() => {
		if (canEditProfile) {
			try {
				localStorage.removeItem('profile:update:forbidden');
				window.dispatchEvent(new Event('profile:update:allowed' as any));
			} catch {}
		}
	}, [canEditProfile]);

	const sectionToTab: Record<string, 'solicitudes' | 'amigos' | 'buscar' | 'bloqueados' | undefined> = {
		friendRequests: 'solicitudes',
		friendsList: 'amigos',
		userSearch: 'buscar',
		blockedUsersList: 'bloqueados',
	};

	const handleSelect = (section: string) => {
		const tab = sectionToTab[section];
		if (tab) {
			params.set('tab', tab);
			setParams(params, { replace: true });
			setSelectedSection('viewProfile');
			if (isMobile) {
				setSidebarOpen(false);
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
			return;
		}
		setSelectedSection(section);
		if (isMobile) {
			setSidebarOpen(false);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const renderContent = () => {
		switch (selectedSection) {
			case 'updateProfile':
				return <UpdateProfilePage />;
			case 'viewProfile':
				default:
				return <ViewProfilePage />;
		}
	};

	const hasAdmin = userHasAdminRole();
	const visibleLinks = navLinks.filter((l) => !l.adminOnly || hasAdmin);

	return (
		<>
			<Header
				logoSrc={Logo}
				variant='gradient'
				navLinks={visibleLinks}
				userRole={hasAdmin ? 'admi' : 'student'}
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={
					<SearchOverlay
						onSearch={(q, cat) =>
							console.log(`Buscar "${q}" en categoría "${cat}"`)
						}
					/>
				}
			/>

			<GridContainer
				variant="desktopFluid"
				columns={{ xs: 4, sm: 8, md: 12 }}
				style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}
			>
				{/* Sidebar fijo en desktop */}
				{!isMobile && (
					<GridColumn
						as="aside"
						span={{ xs: 4, sm: 2, md: 3 }}
						style={{
							position: 'sticky',
							top: 104,
							alignSelf: 'start',
							zIndex: 10,
							boxSizing: 'border-box',
						}}
					>
						<Paper
							elevation={1}
							sx={{
								p: 1.5,
								bgcolor: 'background.paper',
								boxShadow: (theme) => theme.shadows[1],
								borderRadius: 2,
							}}
						>
							<ProfileSidebarMenu
								open={true}
								onClose={undefined}
								onSelect={handleSelect}
								selectedSection={selectedSection}
								canEditProfile={canEditProfile}
							/>
						</Paper>
					</GridColumn>
				)}

				{/* Columna principal */}
				<GridColumn
					as="main"
					span={{ xs: 4, sm: 6, md: 9 }}
					style={{ minWidth: 0, boxSizing: 'border-box' }}
					key={selectedSection}
					self="center"
				>
					{renderContent()}
				</GridColumn>
			</GridContainer>

			{/* Sidebar en móvil */}
			{isMobile && (
				<ProfileSidebarMenu
					open={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
					onSelect={handleSelect}
					selectedSection={selectedSection}
					canEditProfile={canEditProfile}
				/>
			)}

			{/* FAB móvil */}
			<IconButton
				aria-label="Abrir menú de perfil"
				onClick={() => setSidebarOpen(true)}
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
					display: { xs: 'flex', sm: 'none' },
				zIndex: 1400,
				bgcolor: 'primary.main',
				color: 'primary.contrastText',
				boxShadow: 6,
				'&:hover': { bgcolor: 'primary.dark' },
				width: 56,
				height: 56,
				borderRadius: '50%',
				}}
			>
				<AccountCircleIcon />
			</IconButton>
		</>
	);
};

export default HomeProfilePage;

