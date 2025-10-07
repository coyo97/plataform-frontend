// ui/features/profile/HomeProfile.page.tsx
import React, { useState } from 'react';
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

const HomeProfilePage: React.FC = () => {
	const [selectedSection, setSelectedSection] = useState('viewProfile');
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [params, setParams] = useSearchParams();

	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);

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
				// Tabs internas (Solicitudes/Amigos/Buscar) viven dentro de ViewProfile, bajo el header del perfil
				return <ViewProfilePage />;
		}
	};

	return (
		<>
			<Header
				logoSrc={Logo}
				variant="gradient"
				navLinks={navLinks}
				userRole="student"
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={<SearchOverlay onSearch={(q, cat) => console.log(`Buscar "${q}" en "${cat}"`)} />}
			/>

			<GridContainer
				variant="desktopFluid"
				columns={{ xs: 4, sm: 8, md: 12 }}
				style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}
			>
				{/* Sidebar fijo en desktop (patrón Persistent Navigation) */}
				{!isMobile && (
					<GridColumn
						as="aside"
						span={{ xs: 4, sm: 2, md: 3 }} // ≈ 280–300px en desktop
						style={{
							position: 'sticky',
							top: 104, // 88 header + margen
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
							/>
						</Paper>
					</GridColumn>
				)}

				{/* Columna principal: contenido centrado y limitado a 680–760px */}
				<GridColumn
					as="main"
					span={{ xs: 4, sm: 6, md: 9 }}
					style={{ minWidth: 0, boxSizing: 'border-box' }}
					key={selectedSection}
				>
					{renderContent()}
				</GridColumn>
			</GridContainer>

			{/* Sidebar LOCAL en móvil como modal */}
			{isMobile && (
				<ProfileSidebarMenu
					open={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
					onSelect={handleSelect}
					selectedSection={selectedSection}
				/>
			)}

			{/* FAB abajo-derecha (solo móvil) */}
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

