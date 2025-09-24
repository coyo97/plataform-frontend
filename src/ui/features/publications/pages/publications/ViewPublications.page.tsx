/*  ui/features/publications/pages/publications/ViewPublications.page.tsx  */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	fetchCareers,
	createPublication,
	likePublication,
	unlikePublication,
} from '../../../../../async/services/publicationService';
import type { Career, Publication } from '../../../../../types/publication';
import getEnvVariables    from '../../../../../config/configEnvs';

import { usePublicationsFeed }  from '../../hooks/usePublicationsFeed';
import { useInfiniteScroll } from '../../../../shared/hooks/useInfiniteScroll';

import PublicationsFeed   from '../../organisms/publicationsFeed/PublicationsFeed';
import ReportDialog       from '../../organisms/reportDialog/ReportDialog';
import PublicationFile from '../../moleculas/publicationFile/PublicationFile';
import PublicationsLayout from '../../templates/PublicationsLayout';
import { sidebarSX }      from '../../organisms/sidebars/sidebars.styles';
import { getUserId } from '../../../../../utils/auth/getUserId';
import { breakPoints } from '../../../../../config/mq';
import CreatePublicationSidebar from '../../organisms/sidebars/CreatePublicationSidebar';
import FilterPublicationSidebar from '../../organisms/sidebars/FilterPublicationSidebar';

import {
	useTheme, useMediaQuery,
	Fab, Dialog, SwipeableDrawer, Button, Box
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

import Header from '../../../../shared/organisms/header/Header';
import { NavLink,navLinks } from '../../../../../config/navLinks';
import Logo from '../../../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import SearchOverlay from '../../../../shared/organisms/SearchOverlay/SearchOverlay';
import GridColumn from '../../../../shared/atoms/grid/GridColumn';
import GridContainer from '../../../../shared/atoms/grid/GridContainer';

type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

const ViewPublicationsPage: React.FC = () => {
	const [careers,  setCareers]  = useState<Career[]>([]);
	const [careerId, setCareer]   = useState('');
	const [filter,   setFilter]   = useState<Filter>('mostRecent');
	const [query,    setQuery]    = useState('');

	const [showForm   , setShowForm]    = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [report, setReport] = useState<{open:boolean; id:string}>({open:false,id:''});
	const [createOpen, setCreateOpen]  = useState(false); // para CreatePublicationSidebar
	const [filterOpen, setFilterOpen]  = useState(false); // para FilterPublicationSidebar

	const theme    = useTheme();

	const smDown = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);
	const lgUp   = useMediaQuery(`(min-width:${breakPoints.values.lg}px)`);
	const isMobile  = smDown;
	const isDesktop = lgUp;
	const isTablet  = !isMobile && !isDesktop;       // 600 – 1199 px

	const navigate  = useNavigate();
	const { HOST }  = getEnvVariables();
	const uid       = getUserId();

	const {
		pubs, setPubs, load, page, setPage, more, busy,
	} = usePublicationsFeed({ filter, careerId, query });

	/* ---------- infinite scroll hook ---------- */
	const { lastRef } = useInfiniteScroll(
		() => {                     // callback cuando el sentinel entra en viewport
			const next = page + 1;
			load(next);
			setPage(next);
		},
		more && !busy               // habilitado sólo si hay más resultados
	);

	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	useEffect(() => {
		setPubs([]);                // vacía lista
		setPage(1);                 // reinicia paginación
		load(1);                    // vuelve a cargar
	}, [filter, careerId, query]); // eslint-disable-line react-hooks/exhaustive-deps

	const onLike = async(id:string)=>{
		try{
			await likePublication(id);
			setPubs(prev=>prev.map(p=>p._id===id
				? {...p, likes:[...(p.likes??[]),uid]}
				: p));
		}catch(e){console.error(e);}
	};

	const onUnlike = async(id:string)=>{
		try{
			await unlikePublication(id);
			setPubs(prev=>prev.map(p=>p._id===id
				? {...p, likes:(p.likes??[]).filter(u=>u!==uid)}
				: p));
		}catch(e){console.error(e);}
	};

	const handleAuthor = (id:string,user:string)=>
		navigate(`/profile/${user}`,{state:{userProfileId:id}});

	const handleSearch = (q:string)=> setQuery(q);

	const handleNewPost = (p: Publication) => {
		setPubs(prev =>
				prev.some(pub => pub._id === p._id) ? prev : [p, ...prev]
			   );
			   const submitNew = (fd:FormData)=> createPublication(fd);
			   setCreateOpen(false);
	}

	return (
		<>
			<Header
				logoSrc={Logo}
				variant="gradient"
				navLinks={navLinks}
				userRole="student" // o "admin" dinámico según login
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

			<GridContainer variant="desktopFluid" style={{ paddingTop: '88px' }}>
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
								open
								onClose={() => setCreateOpen(false)}
								onNew={handleNewPost}
							/>
						</Dialog>
					</>
				) : (
					<GridColumn span={3}>
						<CreatePublicationSidebar
							open={createOpen}
							onClose={() => setCreateOpen(false)}
							onNew={handleNewPost}
						/>
					</GridColumn>
				)}

				{/* ② FEED (siempre) */}
				<GridColumn span={6}>
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
					<GridColumn span={3}>
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
		</>
	);

};

export default ViewPublicationsPage;

