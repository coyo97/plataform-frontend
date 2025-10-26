import React, { useState } from 'react';
import {
	useTheme,
	useMediaQuery,
	Box,
	Tabs, Tab,
	Fab, Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import StreamCreateForm from '../organisms/StreamCreateForm';
import StreamList from '../organisms/StreamList';
import type { Stream } from '../../../../types/stream';
import { styles } from './homeStreamLayout.styles';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';
import Header from '../../../shared/organisms/header/Header';
import { navLinks } from '../../../../config/navLinks';
import Logo from '../../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import SearchOverlay from '../../../shared/organisms/SearchOverlay/SearchOverlay';
import { userHasAdminRole } from '../../../../utils/auth/getUserId';

type StreamTab = 'live' | 'scheduled' | 'ended' | 'mine';

interface LayoutProps {
	children?: React.ReactNode;
	onStreamCreated: (id: string, access?: string, stream?: Stream) => void;
	onStreamSelected: (s: Stream) => void;
}

const HomeStreamLayout: React.FC<LayoutProps> = ({
	children,
	onStreamCreated,
	onStreamSelected,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [openDrawer, setOpenDrawer] = useState(false);

	const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
	const [accessCode, setAccessCode] = useState<string | undefined>();
	const [activeStream, setActiveStream] = useState<Stream | null>(null);

	const hasChild = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
	const containerVariant = hasChild ? 'desktopFluid' : 'desktopFixed';
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

	const handleStreamCreated = (id: string, access?: string, stream?: Stream) => {
		setActiveStream(stream ?? null);
		setSelectedStreamId(id);
		setAccessCode(access);
		onStreamCreated?.(id, access, stream); // por si el padre navega al detalle
	};

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
					<SearchOverlay onSearch={(q, cat) => console.log(`Buscar "${q}" en categoría "${cat}"`)} />
				}
			/>

			{/* FAB móvil para abrir el formulario como Drawer */}
			{isMobile && (
				<Fab
					aria-label="Crear stream"
					onClick={() => setOpenDrawer(true)}
					sx={{
						position: 'fixed',
						right: 16,
						bottom: 16,
						zIndex: (t) => t.zIndex.modal + 1,
						boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
					}}
					color="primary"
				>
					<MenuIcon />
				</Fab>
			)}

			{/* Drawer con formulario en móvil */}
			<Drawer
				anchor="bottom"
				open={isMobile && openDrawer}
				onClose={() => setOpenDrawer(false)}
				PaperProps={{
					sx: {
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
						maxHeight: '85dvh',
						p: 2,
				},
				}}
				keepMounted
			>
				<SectionTitle>Crear nuevo stream</SectionTitle>
				<Box sx={{ mt: 2 }}>
					<StreamCreateForm
						onStreamCreated={(id, access, stream) => {
							setOpenDrawer(false);
							handleStreamCreated(id, access, stream); // usa el handler local + propaga
						}}
					/>
				</Box>
			</Drawer>
			<GridContainer
				variant={containerVariant}
				style={{ paddingTop: 'calc(var(--header-h) + 12px)' }}
				columns={{ xxs: 4, sm: 6, md: 12 }}
			>
				{/* Columna izquierda: Form (solo desktop y cuando NO hay detalle) */}
				{!isMobile && !hasChild && (
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
							<SectionTitle>Crear nuevo stream</SectionTitle>
							<Box sx={{ mt: 2 }}>
								<StreamCreateForm
									onStreamCreated={(id, access, stream) => {
										handleStreamCreated(id, access, stream);
									}}
								/>
							</Box>
						</Box>
					</GridColumn>
				)}

				{/* Columna derecha: Listado o Children */}
				<GridColumn
					span={
						hasChild
							? { xxs: 12, md: 12, lg: 12, xl: 12 } 
							: { xxs: 12, md: 7,  lg: 7,  xl: 7 }  // layout de lista normal
					}
				>
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

