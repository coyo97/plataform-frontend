// src/ui/components/publications/ViewPublications.tsx
// Todo el tráfico pasa por publicationService + publicationRoutes
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate }   from 'react-router-dom';
import {
	fetchCareers,
	fetchPublications,
	likePublication,
	unlikePublication,
	Career,
	Publication,
}                         from '../../../async/services/publicationService';
import * as R             from '../../../async/routes/publicationRoutes';
import getEnvVariables    from '../../../config/configEnvs';

import PublicationsSidebar         from './PublicationsSidebar';
import PublicationsFilterSidebar   from './PublicationsFilterSidebar';
import PublicationsFeed            from './PublicationsFeed';
import ReportDialog                from './ReportDialog';

import {
	useTheme,
	useMediaQuery,
	Fab,
	Dialog,
	SwipeableDrawer,
	Button,
	Box,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';


const ViewPublications: React.FC = () => {
	/* ---------- estado principal ---------- */
	const [publications, setPublications] = useState<Publication[]>([]);
	const [careers,      setCareers]      = useState<Career[]>([]);
	const [selectedCareer, setCareer]     = useState<string>('');
	const [selectedFilter, setFilter]     = useState<'mostRecent' | 'mostLiked' | 'mostCommented' | 'career'>('mostRecent');
	const [activeQuery, setQuery] = useState<string>('');

	const [page,        setPage]    = useState(1);
	const [hasMore,     setMore]    = useState(true);
	const [isLoading,   setLoad]    = useState(false);

	/* diálogo reporte */
	const [report, setReport] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

	/* responsive helpers */
	const theme        = useTheme();
	const isMobile     = useMediaQuery(theme.breakpoints.down('sm'));  // ≤600 px
	const showRightSB  = useMediaQuery(theme.breakpoints.up('lg'));    // ≥1200 px
	const sidebarSX    = { flex: '0 0 260px', maxWidth: 260 };

	/* visibilidad FAB / Drawer */
	const [showForm,    setShowForm]    = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	/* misc */
	const navigate             = useNavigate();
	const { HOST }             = getEnvVariables();
	const uid                  = localStorage.getItem('userId') ?? '';

	/* ---------- carreras (una vez, con caché) ---------- */
	useEffect(() => {
		fetchCareers()
		.then(setCareers)
		.catch(console.error);
	}, []);

	/* ---------- helper: construir endpoint feed ---------- */
	const pathFor = (pg:number) => {
		if (activeQuery.trim())       return `${R.PUB_SEARCH(activeQuery)}&page=${pg}`;
		if (selectedFilter === 'mostLiked')        return `${R.PUBS_MOST_LIKED}?page=${pg}`;
		if (selectedFilter === 'mostCommented')    return `${R.PUBS_MOST_COMMENT}?page=${pg}`;
		if (selectedFilter === 'career' && selectedCareer)
			return `${R.PUBS_BY_CAREER(selectedCareer)}?page=${pg}`;
		return `${R.PUBS}?page=${pg}`; // default (más recientes)
	};

	/* ---------- fetch publicaciones ---------- */
	const fetchPubs = useCallback(async (pg:number)=>{
		if (isLoading) return;
		setLoad(true);
		try {
			const pubs = await fetchPublications(pathFor(pg));
			setPublications(prev => {
				const m = new Map<string, Publication>();
				[...prev, ...pubs].forEach(p => m.set(p._id, p));
				const arr = Array.from(m.values());
				/* ordenar localmente si el servidor ya lo envía ordenado
				   pero mezclamos prev + new */
				if (selectedFilter==='mostLiked')
				arr.sort((a,b)=> (b.likes?.length||0) - (a.likes?.length||0));
				if (selectedFilter==='mostCommented')
				arr.sort((a,b)=> (b.commentsCount||0) - (a.commentsCount||0));
				return arr;
				});
			setMore(pubs.length > 0);
			} catch (err) {
			console.error(err);
			} finally {
				setLoad(false);
			}
	},
		  [isLoading, selectedFilter, selectedCareer]
			  );

	/* reset feed al cambiar filtros */
	useEffect(() => {
		setPublications([]);
		setPage(1);
		fetchPubs(1);
	}, [selectedFilter, selectedCareer, fetchPubs]);

	/* ---------- infinite scroll ---------- */
	const observer = useRef<IntersectionObserver | null>(null);
	const lastRef  = useCallback(
		(node: HTMLDivElement) => {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					const nxt = page + 1;
					fetchPubs(nxt);
					setPage(nxt);
				}
			});
			if (node) observer.current.observe(node);
		},
		[hasMore, isLoading, page, fetchPubs]
	);

	/* --- like --- */
	/* LIKE ------------------------------------------------ */
	const doLike = useCallback(async (id: string) => {
		try {
			await likePublication(id);               // ←  solo id
			setPublications(prev =>
							prev.map(p =>
									 p._id === id ? { ...p, likes:[...(p.likes ?? []), uid] } : p
									)
						   );
		} catch (e) { console.error(e); }
	}, [uid]);

	/* UNLIKE --------------------------------------------- */
	const doUnlike = useCallback(async (id: string) => {
		try {
			await unlikePublication(id);             // ←  solo id
			setPublications(prev =>
							prev.map(p =>
									 p._id === id
										 ? { ...p, likes:(p.likes ?? []).filter(u => u !== uid) }
										 : p
									)
						   );
		} catch (e) { console.error(e); }
	}, [uid]);

	/* ---------- util render archivo ---------- */
	const renderFile = useCallback(
		(p: Publication) => {
			if (!p.filePath || !p.fileType) return null;
			const url = `${HOST}/${p.filePath}`;

			if (p.fileType.startsWith('image/'))
				return <img src={url} alt={p.title} style={{ width: '100%', maxWidth: 500 }} />;

			if (p.fileType.startsWith('video/'))
				return (
					<video controls style={{ width: '100%', maxWidth: 500 }}>
						<source src={url} type={p.fileType} />
					</video>
				);

				if (p.fileType === 'application/pdf')
					return (
						<a href={url} target="_blank" rel="noreferrer">
							Ver PDF
						</a>
					);

					return (
						<a href={url} download>
							Descargar archivo
						</a>
					);
		},
		[HOST]
	);

	/* ---------- búsqueda ---------- */
	const handleSearch = (q: string) => {
		setQuery(q);         // memoriza la query activa
		setPublications([]); setPage(1); fetchPubs(1);
	};

	/* ---------- autor clic ---------- */
	const handleAuthor = (id: string, user: string) =>
		navigate(`/profile/${user}`, { state: { userProfileId: id } });

	/* ---------- nuevo post ---------- */
	const handleNewPost = (p: Publication) =>
		setPublications(prev => [p, ...prev]);

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'nowrap',
				alignItems: 'flex-start',
				width: '100%',
				padding: 20,
				gap: 24,
			}}
		>
			{/* ① CREAR PUBLICACIÓN */}
			{isMobile ? (
				<>
					<Fab
						color="secondary"
						sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}
						onClick={() => setShowForm(true)}
					>
						<AddIcon />
					</Fab>

					<Dialog fullScreen open={showForm} onClose={() => setShowForm(false)}>
						<Box sx={{ width: '100%' }}>
							<PublicationsSidebar handleNewPublication={handleNewPost} />
						</Box>
					</Dialog>
				</>
			) : (
				<Box sx={sidebarSX}>
					<PublicationsSidebar handleNewPublication={handleNewPost} />
				</Box>
			)}

			{/* ② FEED */}
			<PublicationsFeed
				HOST={HOST}
				publications={publications}
				lastPublicationElementRef={lastRef}
				renderFile={renderFile}
				handleLike={doLike}
				handleUnlike={doUnlike}
				handleAuthorClick={handleAuthor}
				handleOpenReportDialog={id => setReport({ open: true, id })}
				handleSearch={handleSearch}
			/>

			{/* ③ FILTROS */}
			{showRightSB ? (
				<Box sx={sidebarSX}>
					<PublicationsFilterSidebar
						careers={careers}
						selectedCareer={selectedCareer}
						selectedFilter={selectedFilter}
						setSelectedCareer={setCareer}
						setSelectedFilter={setFilter}
						setPage={setPage}
					/>
				</Box>
			) : (
				<>
					<Button
						variant="outlined"
						startIcon={<FilterListIcon />}
						sx={{ position: 'fixed', top: 72, right: 16, zIndex: 1100 }}
						onClick={() => setShowFilters(true)}
					>
						Filtros
					</Button>

					<SwipeableDrawer
						anchor="right"
						open={showFilters}
						onClose={() => setShowFilters(false)}
						onOpen={() => {}}
						PaperProps={{ sx: { width: '80%', maxWidth: 340 } }}
					>
						<Box sx={{ p: 2 }}>
							<PublicationsFilterSidebar
								careers={careers}
								selectedCareer={selectedCareer}
								selectedFilter={selectedFilter}
								setSelectedCareer={setCareer}
								setSelectedFilter={setFilter}
								setPage={setPage}
							/>
						</Box>
					</SwipeableDrawer>
				</>
			)}

			{/* ④ DIÁLOGO REPORTE */}
			{report.open && (
				<ReportDialog
					open={report.open}
					onClose={() => setReport({ open: false, id: '' })}
					publicationId={report.id}
				/>
			)}
		</div>
	);
			};

			export default ViewPublications;

