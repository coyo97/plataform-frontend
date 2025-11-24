// src/ui/features/stream/templates/HomeStreamLayout.tsx
import React, { useState, useEffect } from 'react';
import {
	useTheme,
	useMediaQuery,
	Box,
	Tabs,
	Tab,
	Fab,
	Drawer,
	Snackbar,
	Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import StreamCreateForm from '../organisms/StreamCreateForm';
import StreamList from '../organisms/StreamList';
import type { Stream } from '../../../../types/stream';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';
import Header from '../../../shared/organisms/header/Header';
import { navLinks } from '../../../../config/navLinks';
import Logo from '../../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import SearchOverlay from '../../../shared/organisms/SearchOverlay/SearchOverlay';
import { userHasAdminRole } from '../../../../utils/auth/getUserId';
import type { GridVariant } from '../../../shared/atoms/grid/grid.types';
import { getMyPermissions } from '../../../../async/services/permissionService';
import { getPermissionMessage } from '../../../shared/messages/permissionMessages';
import StreamCreateSidebar from '../organisms/sidebars/StreamCreateSidebar';

import ChatDisclosure from './ChatDisclosure';
import ChatPanel from './ChatPanel';

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
	const gridVariant: GridVariant = isMobile ? 'mobile' : containerVariant;

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
		onStreamCreated?.(id, access, stream);
	};

	const [serverPerms, setServerPerms] = useState<string[] | null>(null);
	const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
	const [permMsg, setPermMsg] = useState<string | null>(null);

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
		return () => { alive = false; };
	}, []);

	const canCreateStream =
		!loadingPerms &&
		(!!serverPerms?.includes('stream:create') ||
		 !!serverPerms?.includes('streams:create'));

	const [chatOpen, setChatOpen] = useState(false);

	const currentStreamId =
		selectedStreamId || (activeStream as any)?._id || null;

	const currentViewers =
		((activeStream as any)?.viewers as { _id: string; username: string }[]) || [];

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

			{isMobile && !hasChild && (
				<Fab
					aria-label="Crear stream"
					onClick={() => {
						if (!canCreateStream) {
							setPermMsg(getPermissionMessage('createDenied'));
							return;
						}
						setOpenDrawer(true);
					}}
					sx={{
						position: 'fixed',
						right: 16,
						bottom: 16,
						zIndex: (t) => t.zIndex.modal + 1,
						boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
						...(!canCreateStream
							? {
								opacity: 0.55,
								cursor: 'not-allowed',
								pointerEvents: 'auto',
							}
							: {}),
					}}
					color="primary"
					aria-disabled={!canCreateStream}
				>
					<MenuIcon />
				</Fab>
			)}

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
							handleStreamCreated(id, access, stream);
						}}
						canCreate={canCreateStream}
						onPermissionDenied={(msg) => setPermMsg(msg)}
					/>
				</Box>
			</Drawer>

			<GridContainer
				variant={gridVariant}
				style={{ paddingTop: 'calc(var(--header-h) + 12px)' }}
				columns={{ xxs: 4, sm: 6, md: 12 }}
			>
				{/* Columna izquierda: Sidebar solo desktop y NO detalle */}
				{!isMobile && !hasChild && (
					<GridColumn span={{ xxs: 12, md: 5, lg: 5, xl: 5 }}>
						<StreamCreateSidebar
							open
							onClose={() => {}}
							canCreate={canCreateStream}
							onStreamCreated={(id, access, stream) => {
								handleStreamCreated(id, access, stream);
							}}
							onPermissionDenied={(msg) => setPermMsg(msg)}
						/>
					</GridColumn>
				)}

				{/* Columna derecha: Listado o Children */}
				<GridColumn
					span={
						hasChild
							? { xxs: 12, md: 12, lg: 12, xl: 12 }
							: { xxs: 12, md: 7, lg: 7, xl: 7 }
					}
				>
					{hasChild ? (
						<>
							{children}

							{currentStreamId && (
								<ChatDisclosure
									open={chatOpen}
									onOpen={() => setChatOpen(true)}
									onClose={() => setChatOpen(false)}
								>
									<ChatPanel
										streamId={currentStreamId}
										viewers={currentViewers}
									/>
								</ChatDisclosure>
							)}
						</>
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
								onSelect={(s) => {
									onStreamSelected(s);

									setActiveStream(s);
									setSelectedStreamId((s as any)?._id || null);
									setAccessCode((s as any)?.accessCode);
								}}
							/>
						</>
					)}
				</GridColumn>
			</GridContainer>

			{/* Snackbar de permisos */}
			<Snackbar
				open={!!permMsg}
				autoHideDuration={4000}
				onClose={() => setPermMsg(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					severity="warning"
					variant="filled"
					onClose={() => setPermMsg(null)}
					sx={{ width: '100%' }}
				>
					{permMsg}
				</Alert>
			</Snackbar>
		</>
	);
};

export default HomeStreamLayout;

