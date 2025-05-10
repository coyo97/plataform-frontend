/*  ui/features/publications/pages/publications/ViewPublications.page.tsx  */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── servicios ────────────────────────────────────────── */
import {
	fetchCareers,
	createPublication,
	likePublication,
	unlikePublication,
} from '../../../../../async/services/publicationService';
import type { Career, Publication } from '../../../../../types/publication';
import getEnvVariables    from '../../../../../config/configEnvs';

/* ── hooks (nuevos) ───────────────────────────────────── */
import { usePublicationsFeed }  from '../../hooks/usePublicationsFeed';
import { useInfiniteScroll } from '../../../../shared/hooks/useInfiniteScroll';

/* ── UI ────────────────────────────────────────────────── */
import PublicationsFeed   from '../../organisms/publicationsFeed/PublicationsFeed';
import CreateSidebar      from '../../organisms/sidebars/CreateSidebar';
import FilterSidebar      from '../../organisms/sidebars/FilterSidebar';
import ReportDialog       from '../../organisms/reportDialog/ReportDialog';
import PublicationFile from '../../moleculas/publicationFile/PublicationFile';
import PublicationsLayout from '../../templates/PublicationsLayout';
import { sidebarSX }      from '../../organisms/sidebars/sidebars.styles';
import { getUserId } from '../../../../../utils/auth/getUserId';

/* ── MUI ──────────────────────────────────────────────── */
import {
	useTheme, useMediaQuery,
	Fab, Dialog, SwipeableDrawer, Button, Box
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

const ViewPublicationsPage: React.FC = () => {
	/* ---------- estado UI ---------- */
	const [careers,  setCareers]  = useState<Career[]>([]);
	const [careerId, setCareer]   = useState('');
	const [filter,   setFilter]   = useState<Filter>('mostRecent');
	const [query,    setQuery]    = useState('');

	/* dialogs & drawers */
	const [showForm   , setShowForm]    = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [report, setReport] = useState<{open:boolean; id:string}>({open:false,id:''});

	/* misc */
	const theme    = useTheme();
	const mobile   = useMediaQuery(theme.breakpoints.down('sm'));   // <600
	const lgUp     = useMediaQuery(theme.breakpoints.up('lg'));     // ≥1200
	const mdOnly   = !mobile && !lgUp;                              // 600-1199

	const navigate  = useNavigate();
	const { HOST }  = getEnvVariables();
	const uid       = getUserId();

	/* ---------- feed hook ---------- */
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

	/* ---------- cargar carreras una vez ---------- */
	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	/* ---------- reset feed al cambiar filtros/búsqueda --- */
	useEffect(() => {
		setPubs([]);                // vacía lista
		setPage(1);                 // reinicia paginación
		load(1);                    // vuelve a cargar
	}, [filter, careerId, query]); // eslint-disable-line react-hooks/exhaustive-deps

	/* ---------- acciones like / unlike -------------------- */
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

	/* ---------- helpers UI -------------------------------- */
	const handleAuthor = (id:string,user:string)=>
		navigate(`/profile/${user}`,{state:{userProfileId:id}});

	const handleSearch = (q:string)=> setQuery(q);

	const handleNewPost = (p:Publication)=> setPubs(prev=>[p,...prev]);

	/* submit real (pasado al Sidebar) */
	const submitNew = (fd:FormData)=> createPublication(fd);

	/* ---------- JSX --------------------------------------- */
	return (
		<PublicationsLayout>

			{/* ① Create – LEFT sidebar */}
			{lgUp ? (
				<Box sx={sidebarSX}>
					<CreateSidebar onNew={handleNewPost}/>
				</Box>
			) : mdOnly ? (
				<>
					<Button variant="contained" startIcon={<AddIcon/>}
						onClick={()=>setShowForm(true)}
						sx={{position:'fixed',bottom:16,left:16,zIndex:1200}}>
						Publicar
					</Button>
					<SwipeableDrawer anchor="left" open={showForm}
						onClose={()=>setShowForm(false)}
						onOpen={() => {}}
						PaperProps={{sx:{width:300}}}>
						<Box sx={{p:2}}>
							<CreateSidebar onNew={handleNewPost}/>
						</Box>
					</SwipeableDrawer>
				</>
			) : (
			/* mobile */
			<>
				<Fab color="secondary"
					sx={{position:'fixed',bottom:16,right:16,zIndex:1200}}
					onClick={()=>setShowForm(true)}>
					<AddIcon/>
				</Fab>
				<Dialog fullScreen open={showForm}
					onClose={()=>setShowForm(false)}>
					<Box sx={{width:'100%'}}>
						<CreateSidebar onNew={handleNewPost}/>
					</Box>
				</Dialog>
			</>
			)}

			{/* ② Feed (siempre) */}
			<Box sx={{ flexGrow:1, minWidth:0, overflow:'auto' }}>
				<PublicationsFeed
					HOST={HOST}
					list={pubs}
					lastRef={lastRef}
					/* ahora usamos la molécula PublicationFile */
					renderFile={p=>(
						<PublicationFile publication={p} baseUrl={HOST}/>
					)}
					onLike={onLike}
					onUnlike={onUnlike}
					onAuthor={handleAuthor}
					onReport={id=>setReport({open:true,id})}
					onSearch={handleSearch}
				/>
			</Box>

			{/* ③ Filter – RIGHT sidebar */}
			{lgUp ? (
				<Box sx={sidebarSX}>
					<FilterSidebar
						careers={careers}
						selectedCareer={careerId}
						selectedFilter={filter}
						setCareer={setCareer}
						setFilter={setFilter}
					/>
				</Box>
			) : (
				<>
					<Button variant="outlined" startIcon={<FilterListIcon/>}
						onClick={()=>setShowFilters(true)}
						sx={{position:'fixed',top:72,right:16,zIndex:1100}}>
						Filtros
					</Button>

					<SwipeableDrawer anchor="right" open={showFilters}
						onClose={()=>setShowFilters(false)}
						onOpen={() => {}}
						PaperProps={{sx:{width:{xs:'80%',sm:320}}}}>
						<Box sx={{p:2}}>
							<FilterSidebar
								careers={careers}
								selectedCareer={careerId}
								selectedFilter={filter}
								setCareer={setCareer}
								setFilter={setFilter}
							/>
						</Box>
					</SwipeableDrawer>
				</>
			)}

			{/* ④ Report dialog */}
			{report.open && (
				<ReportDialog
					open={report.open}
					onClose={()=>setReport({open:false,id:''})}
					publicationId={report.id}
				/>
			)}
		</PublicationsLayout>
	);
};

export default ViewPublicationsPage;

