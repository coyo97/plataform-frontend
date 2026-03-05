import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Box, SwipeableDrawer, Button, Dialog, Fab } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useSearchParams } from 'react-router-dom';

import HelpFeed from './organisms/HelpFeed';
import CreateHelpSidebar from './organisms/CreateHelpSidebar';
import HelpFilterSidebar from './organisms/HelpFilterSidebar';
import { useHelpFeed } from './hook/useHelpFeed';
import { AcademicHelp } from '../../../types/academicHelp';
import AddIcon from '@mui/icons-material/Add';

import Loader from '../../shared/atoms/feedback/loader/Loader';
import FilterListIcon from '@mui/icons-material/FilterList';

import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn from '../../shared/atoms/grid/GridColumn';

import Header from '../../shared/organisms/header/Header';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { navLinks } from '../../../config/navLinks';
import { userHasAdminRole } from '../../../utils/auth/getUserId';
import { getMyPermissions } from '../../../async/services/permissionService';

const HomeAcademicHelp = () => {
	const { helps, setHelps, loading, setFilters, filters } = useHelpFeed();

	const [createOpen, setCreateOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [snack, setSnack] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();
	const overlayOpen = location.pathname === '/plataform/search';

	const [sp] = useSearchParams();
	const [editing, setEditing] = useState<AcademicHelp | null>(null);
	const onlyMine = (filters as any)?.owner === 'me';

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

	const canCreateHelp =
		!loadingPerms &&
		!!(
			serverPerms?.includes('academic-help:create') ||
			serverPerms?.includes('academic-helps:create')
		);

	const canEditHelp =
		!loadingPerms &&
		!!(
			serverPerms?.includes('academic-help:update') ||
			serverPerms?.includes('academic-helps:update')
		);

	const canDeleteHelp =
		!loadingPerms &&
		!!(
			serverPerms?.includes('academic-help:delete') ||
			serverPerms?.includes('academic-helps:delete')
		);

	const canViewMyHelps =
		!loadingPerms &&
		!!(
			serverPerms?.includes('my-academic-help:read') ||
			serverPerms?.includes('my-academic-helps:read')
		);

	const canManageCatalog =
		!loadingPerms &&
		!!(
			serverPerms?.includes('subjects:create') ||
			serverPerms?.includes('units:create')
		);

	useEffect(() => {
		const careerId  = sp.get('careerId')  || '';
		const subjectId = sp.get('subjectId') || '';
		const unitId    = sp.get('unitId')    || '';
		const cycleId   = sp.get('cycleId')   || '';
		const subject   = sp.get('subject')   || ''; // legacy
		const owner     = sp.get('owner') as 'me' | null;

		setFilters({
			...(careerId  ? { careerId }  : {}),
			...(subjectId ? { subjectId } : {}),
			...(unitId    ? { unitId }    : {}),
			...(cycleId   ? { cycleId }   : {}),
			...(subject   ? { subject }   : {}),
			...(owner === 'me' ? { owner: 'me' } : {}),
		});
	}, [sp, setFilters]);

	const handleNew = (h: AcademicHelp) => {
		setHelps((prev) => [h, ...prev]);
		setSnack(true);
	};

	const openCreateSidebar = () => {
		setFilterOpen(false);
		setCreateOpen(true);
	};
	const openFilterSidebar = () => {
		setCreateOpen(false);
		setFilterOpen(true);
	};

	const writeFiltersToUrl = (f: Record<string, string | undefined>) => {
		const next = new URLSearchParams(searchParams);
		['careerId','subjectId','cycleId','requestType','status','subject','owner']
			.forEach(k => next.delete(k));
		Object.entries(f).forEach(([k,v]) => {
			if (v && String(v).trim()) next.set(k, String(v));
		});
		setSearchParams(next);
	};

	const showMyHelps = () => {
		setFilters(prev => ({ ...prev, owner: 'me' }));
		writeFiltersToUrl({ ...Object.fromEntries(searchParams), owner: 'me' } as any);
	};
	const showAllHelps = () => {
		setFilters(prev => {
			const { owner, ...rest } = prev;
			return rest;
		});
		const next = new URLSearchParams(searchParams);
		next.delete('owner');
		setSearchParams(next);
	};

	const hasAdmin = userHasAdminRole();
	const visibleLinks = navLinks.filter((l) => !l.adminOnly || hasAdmin);
	const onEditRequested = (h: AcademicHelp) => setEditing(h);
	const onUpdated = (h: AcademicHelp) => {
		setHelps(prev => prev.map(x => x._id === h._id ? h : x));
		setEditing(null);
	};
	const onDeleted = (id: string) => setHelps(prev => prev.filter(x => x._id !== id));

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

			<GridContainer
				variant="desktopFluid"
				style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}
				columns={{ xs: 4, sm: 8, md: 12 }}
			>
				{/* ① CREATE – LEFT SIDEBAR */}
				{isMobile ? (
					<>
						{/* FAB solo si tiene permiso para crear ayuda */}
						{canCreateHelp && (
							<Fab
								color="secondary"
								sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}
								onClick={() => setCreateOpen(true)}
							>
								<AddIcon />
							</Fab>
						)}

						<Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
							<CreateHelpSidebar
								open={true}
								onClose={() => setCreateOpen(false)}
								onNew={handleNew}
								onShowMyHelps={showMyHelps}
								onShowAll={showAllHelps}
								editHelp={editing}
								editingOpen={!!editing}
								onEditingClose={() => setEditing(null)}
								onUpdated={onUpdated}
								onlyMine={onlyMine}
								canCreate={canCreateHelp}
								canViewMyHelps={canViewMyHelps}
								canManageCatalog={canManageCatalog}
							/>
						</Dialog>
					</>
				) : (
					<GridColumn span={{ sm: 2, md: 3 }} self={'center'}>
						<CreateHelpSidebar
							open={createOpen}
							onClose={() => setCreateOpen(false)}
							onNew={handleNew}
							onShowMyHelps={showMyHelps}
							onShowAll={showAllHelps}
							editHelp={editing}
							editingOpen={!!editing}
							onEditingClose={() => setEditing(null)}
							onUpdated={onUpdated}
							onlyMine={onlyMine}
							canCreate={canCreateHelp}
							canViewMyHelps={canViewMyHelps}
							canManageCatalog={canManageCatalog}
						/>
					</GridColumn>
				)}

				{/* ② FEED (siempre) */}
				<GridColumn span={{ xs: 4, sm: 4, md: 6 }}>
					{loading ? (
						<Loader />
					) : (
						<HelpFeed
							list={helps}
							onDeleted={onDeleted}
							onEditRequested={onEditRequested}
							canEdit={canEditHelp}
							canDelete={canDeleteHelp}
						/>
					)}
				</GridColumn>

				{/* ③ FILTER – RIGHT SIDEBAR */}
				{isMobile ? (
					<>
						<Button
							variant="outlined"
							startIcon={<FilterListIcon />}
							onClick={() => setFilterOpen(true)}
							sx={{ position: 'fixed', top: 72, right: 16, zIndex: 1100 }}
						>
							Filtros
						</Button>

						<SwipeableDrawer
							anchor="right"
							open={filterOpen}
							onClose={() => setFilterOpen(false)}
							onOpen={() => {}}
							PaperProps={{ sx: { width: '0%' } }} 
						>
							<HelpFilterSidebar
								open
								current={filters ?? {}}
								onApply={(f) => {
									setFilters(f);
									writeFiltersToUrl(f as any);
									setFilterOpen(false);
								}}
								onClear={() => {
									setFilters({});
									writeFiltersToUrl({});
								}}
								onClose={() => setFilterOpen(false)}
							/>
						</SwipeableDrawer>
					</>
				) : (
					<GridColumn span={{ sm: 2, md: 3 }} self={'center'}>
						<HelpFilterSidebar
							open={filterOpen}
							current={filters ?? {}}
							onApply={(f) => {
								setFilters(f);
								writeFiltersToUrl(f as any);
								setFilterOpen(false);
							}}
							onClear={() => {
								setFilters({});
								writeFiltersToUrl({});
							}}
							onClose={() => setFilterOpen(false)}
						/>
					</GridColumn>
				)}
			</GridContainer>

			{/* Snackbar de confirmación */}
			<Snackbar
				open={snack}
				autoHideDuration={3000}
				onClose={() => setSnack(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert severity="success" variant="filled">
					¡Ayuda publicada con éxito!
				</Alert>
			</Snackbar>
		</>
	);
};

export default HomeAcademicHelp;

