/*  ui/features/publications/pages/publications/ViewPublications.page.tsx  */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
	fetchCareers,
	createPublication,
	likePublication,
	unlikePublication, deletePublication, fetchMyPublications
} from '../../../../../async/services/publicationService';
import type { Career, Publication } from '../../../../../types/publication';
import getEnvVariables from '../../../../../config/configEnvs';

import { usePublicationsFeed } from '../../hooks/usePublicationsFeed';
import { useInfiniteScroll } from '../../../../shared/hooks/useInfiniteScroll';

import PublicationsFeed from '../../organisms/publicationsFeed/PublicationsFeed';
import ReportDialog from '../../organisms/reportDialog/ReportDialog';
import PublicationFile from '../../moleculas/publicationFile/PublicationFile';
import { getUserId } from '../../../../../utils/auth/getUserId';
import { breakPoints } from '../../../../../config/mq';
import CreatePublicationSidebar from '../../organisms/sidebars/CreatePublicationSidebar';
import FilterPublicationSidebar from '../../organisms/sidebars/FilterPublicationSidebar';
import { userHasAdminRole } from '../../../../../utils/auth/getUserId';

import {
	useTheme, useMediaQuery,
	Fab, Dialog, SwipeableDrawer, Button, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

import Header from '../../../../shared/organisms/header/Header';
import { navLinks } from '../../../../../config/navLinks';
import Logo from '../../../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import SearchOverlay from '../../../../shared/organisms/SearchOverlay/SearchOverlay';
import GridColumn from '../../../../shared/atoms/grid/GridColumn';
import GridContainer from '../../../../shared/atoms/grid/GridContainer';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

// util simple para normalizar (opcional)
const normalizeTag = (s: string) =>
	s.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();

	const ViewPublicationsPage: React.FC = () => {
		const [careers, setCareers] = useState<Career[]>([]);
		const [careerId, setCareer] = useState('');
		const [filter, setFilter] = useState<Filter>('mostRecent');
		const [query, setQuery] = useState('');

		const [report, setReport] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
		const [createOpen, setCreateOpen] = useState(false);
		const [filterOpen, setFilterOpen] = useState(false);

		const theme = useTheme();
		const smDown = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);
		const lgUp = useMediaQuery(`(min-width:${breakPoints.values.lg}px)`);
		const isMobile = smDown;
		const isDesktop = lgUp;

		const navigate = useNavigate();
		const { HOST } = getEnvVariables();
		const uid = getUserId();
		const [editing, setEditing] = useState<Publication | null>(null);
		const [confirmDel, setConfirmDel] = useState<Publication | null>(null);
		const [searchParams, setSearchParams] = useSearchParams();
		const [onlyMine, setOnlyMine] = useState(false);

		const activeTag = (() => {
			const t = searchParams.get('tag') || '';
			return t ? normalizeTag(t) : '';
		})();

		const {
			pubs, setPubs, load, page, setPage, more, busy,
		} = usePublicationsFeed({ filter, careerId, query, tag: activeTag });

		/* ---------- infinite scroll hook ---------- */
		const { lastRef } = useInfiniteScroll(
			() => {
				if (onlyMine) return;
				const next = page + 1;
				load(next);
				setPage(next);
			},
			more && !busy
		);

		// Mostrar solo mis publicaciones
		const showMyPosts = async () => {
			const mine = await fetchMyPublications();
			setOnlyMine(true);
			setPubs(mine);           // reemplaza el feed por las tuyas
			setPage(1);
		};

		// Volver al feed general
		const showAllPosts = async () => {
			setOnlyMine(false);
			setPubs([]);
			setPage(1);
			await load(1);
		};

		useEffect(() => {
			fetchCareers().then(setCareers).catch(console.error);
		}, []);

		useEffect(() => {
			if (onlyMine) return;
			setPubs([]);
			setPage(1);
			load(1);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [filter, careerId, query, activeTag, onlyMine]);

		const onLike = async (id: string) => {
			try {
				await likePublication(id);
				setPubs(prev => prev.map(p => p._id === id
					? { ...p, likes: [...(p.likes ?? []), uid] }
					: p));
			} catch (e) { console.error(e); }
		};

		const onUnlike = async (id: string) => {
			try {
				await unlikePublication(id);
				setPubs(prev => prev.map(p => p._id === id
					? { ...p, likes: (p.likes ?? []).filter(u => u !== uid) }
					: p));
			} catch (e) { console.error(e); }
		};

		const handleAuthor = (id: string, user: string) =>
			navigate(`/profile/${user}`, { state: { userProfileId: id } });

		const handleSearch = (q: string) => setQuery(q);

		const handleNewPost = (p: Publication) => {
			setPubs(prev => prev.some(pub => pub._id === p._id) ? prev : [p, ...prev]);
			const submitNew = (fd: FormData) => createPublication(fd);
			setCreateOpen(false);
		};

		// ✅ handler para tags: escribe ?tag=<tag> y reinicia a página 1
		const handleTagClick = (tag: string) => {
			const t = normalizeTag(tag);
			const next = new URLSearchParams(searchParams);
			if (t) {
				next.set('tag', t);
				next.set('page', '1');
			} else {
				next.delete('tag');
				next.delete('page');
			}
			setSearchParams(next);
		};

		// limpiar filtro tag (si quieres mostrar un botón)
		const clearTag = () => {
			const next = new URLSearchParams(searchParams);
			next.delete('tag');
			next.delete('page');
			setSearchParams(next);
		};
		const hasAdmin = userHasAdminRole();
		const visibleLinks = navLinks.filter((l) => !l.adminOnly || hasAdmin);

		const onEditRequested = (p: Publication) => setEditing(p);

		// al actualizar, reemplaza en el feed
		const onUpdated = (p: Publication) => {
			console.log('[onUpdated] received:', p);
			setPubs(prev => prev.map(x => x._id === p._id ? p : x));
			setEditing(null);
		};

		// eliminar con confirmación
		const onDeleted = (p: Publication) => setConfirmDel(p);
		const doDelete = async () => {
			if (!confirmDel) return;
			try {
				await deletePublication(confirmDel._id);
				setPubs(prev => prev.filter(x => x._id !== confirmDel._id));
			} catch (e) {
				console.error(e);
			} finally {
				setConfirmDel(null);
			}
		};
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
					style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}
					columns={{ xs: 4, sm: 8, md: 12 }}
				>
					{/* ① CREATE – LEFT SIDEBAR */}
					{isMobile ? (
						<>
							<Fab
								color="secondary"
								sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}
								onClick={() => setCreateOpen(true)}
							>
								<AddIcon />
							</Fab>

							<Dialog
								fullScreen
								open={createOpen}
								onClose={() => setCreateOpen(false)}
							>
								<CreatePublicationSidebar
									open={true}
									onClose={() => setCreateOpen(false)}
									onNew={handleNewPost}
									editPublication={editing}
									editingOpen={!!editing}
									onEditingClose={() => setEditing(null)}
									onUpdated={onUpdated}
									onShowMyPosts={showMyPosts}
									onShowAll={showAllPosts}
									onlyMine={onlyMine}
								/>
							</Dialog>
						</>
					) : (
						<GridColumn span={{ sm: 2, md: 3 }}>
							<CreatePublicationSidebar
								open={createOpen}
								onClose={() => setCreateOpen(false)}
								onNew={handleNewPost}
								editPublication={editing}
								editingOpen={!!editing}
								onEditingClose={() => setEditing(null)}
								onUpdated={onUpdated}
								onShowMyPosts={showMyPosts}
								onShowAll={showAllPosts}
								onlyMine={onlyMine}
							/>
						</GridColumn>
					)}

					{/* ② FEED (siempre) */}
					<GridColumn span={{ xs: 4, sm: 4, md: 6 }}>
						{activeTag ? (
							<Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
								<span style={{ color: '#666', fontSize: 13 }}>
									Filtrando por: <strong>#{activeTag}</strong>
								</span>
								<Button size="small" variant="text" onClick={clearTag}>
									Limpiar
								</Button>
							</Box>
						) : null}

						<PublicationsFeed
							HOST={HOST}
							list={pubs}
							lastRef={lastRef}
							renderFile={(p) => (
								<PublicationFile publication={p} baseUrl={HOST} />
							)}
							onLike={onLike}
							onUnlike={onUnlike}
							onAuthor={handleAuthor}
							onReport={(id) => setReport({ open: true, id })}
							onSearch={handleSearch}
							/* 🔗 ahora sí: los tags disparan este handler */
							onTagClick={handleTagClick}
							onEditRequested={onEditRequested}
							onDeleted={onDeleted}
						/>
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
								PaperProps={{ sx: { width: '80%' } }}
							>
								<FilterPublicationSidebar
									open
									onClose={() => setFilterOpen(false)}
									careers={careers}
									selectedCareer={careerId}
									selectedFilter={filter}
									setCareer={setCareer}
									setFilter={setFilter}
								/>
							</SwipeableDrawer>
						</>
					) : (
						<GridColumn span={{ sm: 2, md: 3 }}>
							<FilterPublicationSidebar
								open={filterOpen}
								onClose={() => setFilterOpen(false)}
								careers={careers}
								selectedCareer={careerId}
								selectedFilter={filter}
								setCareer={setCareer}
								setFilter={setFilter}
							/>
						</GridColumn>
					)}
				</GridContainer>

				{/* ④ REPORT DIALOG */}
				{report.open && (
					<ReportDialog
						open={report.open}
						onClose={() => setReport({ open: false, id: '' })}
						publicationId={report.id}
					/>
				)}
				{/* ④ REPORT DIALOG */}
				{report.open && (
					<ReportDialog
						open={report.open}
						onClose={() => setReport({ open: false, id: '' })}
						publicationId={report.id}
					/>
				)}

				{/* ⑤ CONFIRMAR ELIMINAR */}
				<MuiDialog
					open={!!confirmDel}
					onClose={() => setConfirmDel(null)}
					maxWidth="xs"
					fullWidth
				>
					<DialogTitle>Eliminar publicación</DialogTitle>
					<DialogContent dividers>
						{`¿Seguro que quieres eliminar “${confirmDel?.title ?? ''}”? Esta acción no se puede deshacer.`}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setConfirmDel(null)}>Cancelar</Button>
						<Button color="error" onClick={doDelete}>Eliminar</Button>
					</DialogActions>
				</MuiDialog>

			</>
		);
	};

	export default ViewPublicationsPage;

