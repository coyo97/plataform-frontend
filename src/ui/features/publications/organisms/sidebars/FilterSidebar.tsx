import React from 'react';
import SectionTitle   from '../../../../shared/atoms/titles/SectionTitle';

import AccordionSection from '../../../../shared/molecules/accordionSection/AccordionSection';
import { FilterButton } from './sidebars.styles';
import GhostButton from '../../../../shared/atoms/buttons/ghostButton/GhostButton';

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
			<GhostButton label="Más recientes" colorType="primary"onClick={() => setFilter('mostRecent')}/>
			<GhostButton label="Más gustadas" colorType='secondary' onClick={()=>setFilter('mostLiked')}/>
			<GhostButton label='Más comentadas' colorType='primary' onClick={()=>setFilter('mostCommented')}/>
			{/*<FilterButton active={selectedFilter==='mostCommented'}
				onClick={()=>setFilter('mostCommented')}>Más comentadas</FilterButton>*/}
		</AccordionSection>

		<FilterButton active={selectedFilter==='mostRecent'&&selectedCareer===''}
			onClick={()=>{ setCareer(''); setFilter('mostRecent'); }}>
			Ver todas
		</FilterButton>
	</>
);

export default FilterSidebar;

