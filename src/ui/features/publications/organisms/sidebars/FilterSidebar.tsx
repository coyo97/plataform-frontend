import React from 'react';
import SectionTitle   from '../../../../shared/atoms/titles/SectionTitle';

import AccordionSection from '../../../../shared/molecules/accordionSection/AccordionSection';
import { FilterButton } from './sidebars.styles';

import { Career } from '../../../../../types/publication';
export type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

interface Props {
	careers      : Career[];
	selectedCareer: string;
	selectedFilter: Filter;
	setCareer    : (id:string) => void;     // nombres acortados
	setFilter    : (f:Filter)  => void;
}

const FilterSidebar:React.FC<Props>=({
	careers, selectedCareer, selectedFilter,
	setCareer, setFilter,
})=>(
	<>
		<SectionTitle>Filtrar publicaciones</SectionTitle>

		<AccordionSection title="Por carrera">
			{careers.map(c=>(
				<FilterButton key={c._id}
					active={selectedCareer===c._id}
					onClick={()=>{ setCareer(c._id); setFilter('career'); }}>
					{c.name}
				</FilterButton>
			))}
		</AccordionSection>

		<AccordionSection title="Orden">
			<FilterButton active={selectedFilter==='mostRecent'}
				onClick={()=>setFilter('mostRecent')}>Más recientes</FilterButton>
			<FilterButton active={selectedFilter==='mostLiked'}
				onClick={()=>setFilter('mostLiked')}>Más gustadas</FilterButton>
			<FilterButton active={selectedFilter==='mostCommented'}
				onClick={()=>setFilter('mostCommented')}>Más comentadas</FilterButton>
		</AccordionSection>

		<FilterButton active={selectedFilter==='mostRecent'&&selectedCareer===''}
			onClick={()=>{ setCareer(''); setFilter('mostRecent'); }}>
			Ver todas
		</FilterButton>
	</>
);

export default FilterSidebar;

