// src/ui/features/stream/templates/HomeStreamLayout.tsx
import React, { useState } from 'react';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import StreamCreateForm from '../organisms/StreamCreateForm';
import StreamList from '../organisms/StreamList';
import type { Stream } from '../../../../types/stream';
import { styles } from './homeStreamLayout.styles';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';
import IconButton from '../../../shared/atoms/buttons/iconButton/IconButton';
import Sidebar from '../../../shared/organisms/sidebar/Sidebar';
import Header from '../../../shared/organisms/header/Header';
import { navLinks } from '../../../../config/navLinks';
import Logo from '../../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import SearchOverlay from '../../../shared/organisms/SearchOverlay/SearchOverlay';
import { Tabs, Tab, Box } from '@mui/material';
import { userHasAdminRole } from '../../../../utils/auth/getUserId';

interface LayoutProps {
	children?: React.ReactNode;
	onStreamCreated: (id: string, access?: string) => void;
	onStreamSelected: (s: Stream) => void;
}
type StreamTab = 'live' | 'scheduled' | 'ended' | 'mine';

const HomeStreamLayout: React.FC<LayoutProps> = ({
	children,
	onStreamCreated,
	onStreamSelected,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [openSidebar, setOpenSidebar] = useState(false);

	const hasChild = Array.isArray(children) ? children.some(Boolean) : Boolean(children);

	const [tab, setTab] = useState<StreamTab>('live');
	const listTypeFor = (t: StreamTab): 'live' | 'ended' | 'all' => {
		if (t === 'live') return 'live';
		if (t === 'ended') return 'ended';
		return 'all';
	};
	const filtersFor = (t: StreamTab) => ({
		scheduled: t === 'scheduled' || undefined,
		mine: t === 'mine' || undefined,
	});
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
					{/* Botón hamburguesa (solo mobile) */}
			{isMobile && (
				<IconButton
					ariaLabel="Abrir menú"
					onClick={() => setOpenSidebar(true)}
					sx={styles.menuButton(theme)}
				>
					<MenuIcon />
				</IconButton>
			)}

			<GridContainer
				variant="desktopFixed"
				style={{ paddingTop: 'calc(var(--header-h) + 20px)' }}
				columns={{ xxs: 4, sm: 6, md: 12 }}
			>
				{/* Columna izquierda: Form */}
				{isMobile ? (
					<GridColumn span={{ xxs: 12 }}>
						<Sidebar
							open={openSidebar}
							onClose={() => setOpenSidebar(false)}
							variant="flat"
							position="left"
							header={<SectionTitle>Crear nuevo stream</SectionTitle>}
							/* En móvil ocupa todo el ancho */
							width={undefined}
						>
							<StreamCreateForm onStreamCreated={onStreamCreated} />
						</Sidebar>
					</GridColumn>
				) : (
					<GridColumn span={{ xxs: 12, md: 5, lg: 5, xl: 5 }}>
						<Box
							sx={{
								position: 'sticky',
								top: 'calc(var(--header-h) + 20px)',
								alignSelf: 'start',
								maxHeight: 'calc(100dvh - var(--header-h) - 32px)',
								overflow: 'auto',
								contain: 'layout paint',
								width: '100%',
								scrollbarWidth: 'none',
								'&::-webkit-scrollbar': { display: 'none' },
							}}
						>
							<Sidebar
								open
								sticky
								variant="flat"
								position="left"
								header={<SectionTitle>Crear nuevo stream</SectionTitle>}
								width={300} // ~600px recomendado (Refactoring UI 400–600px)
							>
								<StreamCreateForm onStreamCreated={onStreamCreated} />
							</Sidebar>
						</Box>
					</GridColumn>
				)}

				{/* Columna derecha: Listado */}
				<GridColumn span={{ xxs: 12, md: 7, lg: 7, xl: 7 }}>
					{hasChild ? (
						children
					) : (
						<>
							<Box sx={{ mb: 2 }}>
								<Tabs
									value={tab}
									onChange={(_, v) => setTab(v)}
									variant="scrollable"
									allowScrollButtonsMobile
									aria-label="Filtros de streams"
								>
									<Tab value="live" label="En directo" />
									<Tab value="scheduled" label="Programados" />
									<Tab value="ended" label="Finalizados" />
									<Tab value="mine" label="Mis streams" />
								</Tabs>
							</Box>

							<StreamList
								key={tab}
								type={listTypeFor(tab)}
								filters={filtersFor(tab)}
								onSelect={onStreamSelected}
							/>
						</>
					)}
				</GridColumn>
			</GridContainer>
		</>
	);
};

export default HomeStreamLayout;

