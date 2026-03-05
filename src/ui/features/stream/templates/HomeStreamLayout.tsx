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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
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

import { fetchMyCareers } from '../../../../async/services/careerService'; // NUEVO

type StreamTab = 'live' | 'scheduled' | 'ended' | 'mine';

type CareerFilterMode = 'my' | 'all' | 'specific';

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


	const [careerFilterMode, setCareerFilterMode] =
		useState<CareerFilterMode>('my');
	const [selectedCareerId, setSelectedCareerId] = useState<string>('');
	const [myCareers, setMyCareers] = useState<any[]>([]);
	const [loadingCareers, setLoadingCareers] = useState<boolean>(true);

	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const careers = await fetchMyCareers();
				if (!alive) return;

				setMyCareers(careers || []);

				if (careers && careers.length === 1) {
					const c = careers[0];
					const id = c._id || c.id || c.careerId || '';
					setSelectedCareerId(id);
				}
			} catch (err) {
				if (alive) {
					setMyCareers([]);
				}
			} finally {
				if (alive) setLoadingCareers(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);

	const resolveCareerIds = (): string[] | undefined => {
		if (careerFilterMode === 'all') {
			return undefined; // sin filtro por carrera
		}

		if (careerFilterMode === 'specific' && selectedCareerId) {
			return [selectedCareerId];
		}

		const ids =
			myCareers
				?.map((c: any) => c._id || c.id || c.careerId)
				.filter(Boolean) ?? [];

		return ids.length ? ids : undefined;
	};

	const listTypeFor = (t: StreamTab): 'live' | 'ended' | 'all' => {
		if (t === 'live') return 'live';
		if (t === 'ended') return 'ended';
		return 'all';
	};

	const filtersFor = (t: StreamTab) => ({
		scheduled: t === 'scheduled' || undefined,
		mine: t === 'mine' || undefined,
		careerIds: resolveCareerIds(), // NUEVO: se inyecta el filtro de carreras
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

			{/* FAB solo si puede crear streams (mobile) */}
			{isMobile && !hasChild && canCreateStream && (
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
				{/* Columna izquierda: Sidebar solo desktop, sin detalle y SOLO si puede crear */}
				{!isMobile && !hasChild && canCreateStream && (
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
							{/* Fila de filtros: carrera + tabs */}
							<Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 1,
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<SectionTitle>
										Streams
									</SectionTitle>

									<FormControl
										size="small"
										sx={{ minWidth: 220 }}
										disabled={loadingCareers}
									>
										<InputLabel id="stream-career-filter-label">
											Carrera
										</InputLabel>
										<Select
											labelId="stream-career-filter-label"
											label="Carrera"
											value={
												careerFilterMode === 'all'
													? 'all'
													: careerFilterMode === 'my'
													? 'my'
													: selectedCareerId || 'my'
											}
											onChange={(e) => {
												const value = e.target.value as string;
												if (value === 'all') {
													setCareerFilterMode('all');
												} else if (value === 'my') {
													setCareerFilterMode('my');
												} else {
													setCareerFilterMode('specific');
													setSelectedCareerId(value);
												}
											}}
										>
											<MenuItem value="my">Mis carreras</MenuItem>
											<MenuItem value="all">Todas las carreras</MenuItem>

											{myCareers && myCareers.length > 0 && (
												<MenuItem disabled>
													────────────────
												</MenuItem>
											)}

											{myCareers?.map((c: any) => {
												const id = c._id || c.id || c.careerId;
												return (
													<MenuItem key={id} value={id}>
														{c.name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</Box>

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

