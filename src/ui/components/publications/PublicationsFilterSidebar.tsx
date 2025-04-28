// src/ui/components/publications/PublicationsFilterSidebar.tsx
import React from 'react';
import {
	SidebarContainer, FilterTitle, FilterButton
} from './viewPublicationsStyles.styles';
import {
	Typography, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Career { _id: string; name: string; }

type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

interface Props {
	careers          : Career[];
	selectedCareer   : string;
	selectedFilter   : Filter;
	setSelectedCareer: (v: string) => void;
	setSelectedFilter: (f: Filter) => void;
	setPage          : (n: number) => void;
}

const PublicationsFilterSidebar: React.FC<Props> = ({
	careers, selectedCareer, selectedFilter,
	setSelectedCareer, setSelectedFilter, setPage,
}) => (
	<SidebarContainer>

		<FilterTitle>Filtrar Publicaciones</FilterTitle>

		{/* ── Carrera ─────────────────────────────────────── */}
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon/>}>
				<Typography>Filtrar por Carrera</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{careers.map(c => (
					<FilterButton key={c._id}
						active={selectedCareer === c._id}
						onClick={() => {
							setSelectedCareer(c._id);
							setSelectedFilter('career');
							setPage(1);
						}}>
						{c.name}
					</FilterButton>
				))}
			</AccordionDetails>
		</Accordion>

		{/* ── Ordenamiento ───────────────────────────────── */}
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon/>}>
				<Typography>Ordenar Publicaciones</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<FilterButton active={selectedFilter==='mostRecent'}
					onClick={()=>{
						setSelectedFilter('mostRecent');
						setSelectedCareer('');
						setPage(1);
					}}>Más recientes</FilterButton>

				<FilterButton active={selectedFilter==='mostLiked'}
					onClick={()=>{
						setSelectedFilter('mostLiked');
						setSelectedCareer('');
						setPage(1);
					}}>Más gustadas</FilterButton>

				<FilterButton active={selectedFilter==='mostCommented'}
					onClick={()=>{
						setSelectedFilter('mostCommented');
						setSelectedCareer('');
						setPage(1);
					}}>Más comentadas</FilterButton>
			</AccordionDetails>
		</Accordion>

		{/* ── Limpiar ────────────────────────────────────── */}
		<FilterButton
			active={selectedFilter==='mostRecent' && selectedCareer==='' }
			onClick={()=>{
				setSelectedFilter('mostRecent');
				setSelectedCareer('');
				setPage(1);
			}}>
			Ver todas las publicaciones
		</FilterButton>
	</SidebarContainer>
);

export default PublicationsFilterSidebar;

