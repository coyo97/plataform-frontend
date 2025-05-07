/*  ui/features/publications/pages/publications/ViewPublications.page.tsx  */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	fetchCareers,
	fetchPublications,
	createPublication,
	likePublication,
	unlikePublication,
	Career,
	Publication,
} from '../../../../../async/services/publicationService';
import * as R from '../../../../../async/routes/publicationRoutes';
import getEnvVariables from '../../../../../config/configEnvs';

/* ── organismos ─────────────────────────────────────── */
import PublicationsFeed from '../../organisms/publicationsFeed/PublicationsFeed';
import CreateSidebar    from '../../organisms/sidebars/CreateSidebar';
import FilterSidebar    from '../../organisms/sidebars/FilterSidebar';
import ReportDialog     from '../../organisms/reportDialog/ReportDialog';

/* ── MUI ─────────────────────────────────────────────── */
import {
	useTheme, useMediaQuery,
	Fab, Dialog, SwipeableDrawer, Button, Box
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import PublicationsLayout from '../../templates/PublicationsLayout';
import { sidebarSX } from '../../organisms/sidebars/sidebars.styles';

type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

const ViewPublicationsPage: React.FC = () => {
	/* ---------- estado UI ---------- */
	const [pubs,     setPubs]     = useState<Publication[]>([]);
	const [careers,  setCareers]  = useState<Career[]>([]);
	const [careerId, setCareer]   = useState('');
	const [filter,   setFilter]   = useState<Filter>('mostRecent');
	const [query,    setQuery]    = useState('');

	const [page , setPage ] = useState(1);
	const [more , setMore ] = useState(true);
	const [busy , setBusy ] = useState(false);

	/* dialogs & drawers */
	const [showForm   , setShowForm]    = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [report, setReport] = useState<{open:boolean; id:string}>({open:false,id:''});

	/* misc */
	const theme    = useTheme();
	/* HOOKS DE RUPTURA */
	const mobile  = useMediaQuery(theme.breakpoints.down('sm')); // <600
	const lgUp    = useMediaQuery(theme.breakpoints.up('lg'));   // ≥1200
	const mdOnly  = !mobile && !lgUp;                             // 600‑1199

	const navigate = useNavigate();
	const { HOST } = getEnvVariables();
	const uid      = localStorage.getItem('userId') ?? '';

	/* ---------- carreras ---------- */
	useEffect(()=>{
		fetchCareers().then(setCareers).catch(console.error);
	},[]);

	/* ---------- endpoint helper ---- */
	const pathFor = useCallback((pg:number)=>{
		if (query.trim())                 return `${R.PUB_SEARCH(query)}&page=${pg}`;
		if (filter==='mostLiked')         return `${R.PUBS_MOST_LIKED}?page=${pg}`;
		if (filter==='mostCommented')     return `${R.PUBS_MOST_COMMENT}?page=${pg}`;
		if (filter==='career' && careerId)return `${R.PUBS_BY_CAREER(careerId)}?page=${pg}`;
		return `${R.PUBS}?page=${pg}`;
	},[filter, careerId, query]);

	/* ---------- cargar feed -------- */
	const load = useCallback(async(pg:number)=>{
		if (busy) return;
		setBusy(true);
		try{
			const data = await fetchPublications(pathFor(pg));
			setMore(data.length>0);
			setPubs(prev=>{
				const map = new Map<string,Publication>();
				[...prev, ...data].forEach(p=>map.set(p._id,p));

				const arr = Array.from(map.values());
				if (filter==='mostLiked')
					arr.sort((a,b)=>(b.likes?.length||0)-(a.likes?.length||0));
				if (filter==='mostCommented')
					arr.sort((a,b)=>(b.commentsCount||0)-(a.commentsCount||0));
				return arr;
			});
		}catch(e){console.error(e);}
		finally{setBusy(false);}
	},[busy, pathFor, filter]);

	/* reset al cambiar filtros / búsqueda */
	useEffect(()=>{
		setPubs([]); setPage(1);
		load(1);
	},[filter, careerId, query, load]);

	/* ---------- infinite scroll ---- */
	const obs = useRef<IntersectionObserver|null>(null);
	const lastRef = useCallback((node:HTMLDivElement)=>{
		if(obs.current) obs.current.disconnect();
		obs.current = new IntersectionObserver(ent=>{
			if(ent[0].isIntersecting && more && !busy){
				const nxt = page+1;
				load(nxt); setPage(nxt);
			}
		});
		if(node) obs.current.observe(node);
	},[more,busy,page,load]);

	/* ---------- likes -------------- */
	const onLike = async(id:string)=>{
		try{ await likePublication(id);
			setPubs(prev=>prev.map(p=>p._id===id
				? {...p, likes:[...(p.likes??[]),uid]}
				: p));
		}catch(e){console.error(e);}
	};

	const onUnlike = async(id:string)=>{
		try{ await unlikePublication(id);
			setPubs(prev=>prev.map(p=>p._id===id
				? {...p, likes:(p.likes??[]).filter(u=>u!==uid)}
				: p));
		}catch(e){console.error(e);}
	};

	/* ---------- archivo adjunto ---- */
	const renderFile = (p:Publication)=>{
		if(!p.filePath||!p.fileType) return null;
		const url = `${HOST}/${p.filePath}`;
		if (p.fileType.startsWith('image/'))
			return <img src={url} alt={p.title} style={{width:'100%',maxWidth:500}}/>;
		if (p.fileType.startsWith('video/'))
			return <video controls style={{width:'100%',maxWidth:500}}>
				<source src={url} type={p.fileType}/>
			</video>;
			if (p.fileType==='application/pdf')
				return <a href={url} target="_blank" rel="noreferrer">Ver PDF</a>;
			return <a href={url} download>Descargar archivo</a>;
	};

	/* ---------- callbacks UI ------- */
	const handleAuthor = (id:string,user:string)=>
		navigate(`/profile/${user}`,{state:{userProfileId:id}});

	const handleSearch = (q:string)=> setQuery(q);
	const handleNewPost = (p:Publication)=> setPubs(prev=>[p,...prev]);

	/* ---------- crear publicación -- */
	const submitNew = (fd:FormData)=> createPublication(fd);  // Promise<Publication>

	/* ---------- JSX ---------------- */
	return (
		<PublicationsLayout>

			{/* ① Create ‑‑ LEFT sidebar */}
			{lgUp && (                                   /*  Desktop ≥lg  */
			<Box sx={sidebarSX}>
				<CreateSidebar onNew={handleNewPost}/>
			</Box>
					 )}

			{mdOnly && (                                 /*  Tablet / md  */
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
					   )}

			{mobile && (                                 /*  Mobile / xs  */
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
			<Box sx={{ flexGrow:1, minWidth:0,overflowX:'hidden', overflowY:'auto' }}>
				<PublicationsFeed 
					HOST={HOST}
					list={pubs}
					lastRef={lastRef}
					renderFile={renderFile}
					onLike={onLike}
					onUnlike={onUnlike}
					onAuthor={handleAuthor}
					onReport={id => setReport({ open: true, id })}
					onSearch={handleSearch}/>
			</Box>

			{/* ③ Filter ‑‑ RIGHT sidebar */}
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

			{/* ④ Report Dialog */}
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

