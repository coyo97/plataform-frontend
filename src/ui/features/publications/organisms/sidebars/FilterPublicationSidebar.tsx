// ui/features/publications/organisms/sidebars/FilterPublicationSidebar.tsx
import React from 'react';
import Sidebar from '../../../../shared/organisms/sidebar/Sidebar';
import SectionTitle from '../../../../shared/atoms/titles/SectionTitle';
import AccordionSection from '../../../../shared/molecules/accordionSection/AccordionSection';
import GhostButton from '../../../../shared/atoms/buttons/ghostButton/GhostButton';
import { Career } from '../../../../../types/publication';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import CareerSelector from '../../../../shared/molecules/selector/CareerSelector';

export type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

interface Props {
	careers        : Career[];
	selectedCareer : string;
	selectedFilter : Filter;
	setCareer      : (id: string) => void;
	setFilter      : (f: Filter) => void;
	open           : boolean;
	onClose        : () => void;
}

const FilterPublicationSidebar: React.FC<Props> = ({
	careers,
	selectedCareer,
	selectedFilter,
	setCareer,
	setFilter,
	open,
	onClose,
}) => (
	<Sidebar
		sticky
		width={220}
		variant="surface"
		//header={<SectionTitle>Filtrar publicaciones</SectionTitle>}
		open={open}
		onClose={onClose}
	>
		{/* ── Filtrado por carrera ─────────────────────────── */}
		<AccordionSection title="Filtrar" >
			<CareerSelector
				careers={careers}              // el mismo array que recibes
				value={selectedCareer}         // id seleccionado o ''
				onChange={(id) => {
					setCareer(id);
					setFilter('career');
				}}
				// Opcionales
				// Deshabilita label porque ya lo da el Accordion
			/>
		</AccordionSection>

		{/* ── Ordenamiento ────────────────────────────────── */}
		<AccordionSection title="Ordenar">
			<SmartBox column gap="px4">
				<GhostButton
					label="Más recientes"
					fullWidth
					variant={selectedFilter === 'mostRecent' && !selectedCareer ? 'contained' : 'text'}
					colorType="primary"
					onClick={() => setFilter('mostRecent')}
				/>
				<GhostButton
					label="Más gustadas"
					fullWidth
					variant={selectedFilter === 'mostLiked' ? 'contained' : 'text'}
					colorType="secondary"
					onClick={() => setFilter('mostLiked')}
				/>
				<GhostButton
					label="Más comentadas"
					fullWidth
					variant={selectedFilter === 'mostCommented' ? 'contained' : 'text'}
					colorType="primary"
					onClick={() => setFilter('mostCommented')}
				/>
			</SmartBox>
		</AccordionSection>

		{/* ── Ver todas ───────────────────────────────────── */}
		<GhostButton
			label="Ver todas"
			fullWidth
			variant={selectedFilter === 'mostRecent' && selectedCareer === '' ? 'contained' : 'text'}
			colorType="secondary"
			onClick={() => {
				setCareer('');
				setFilter('mostRecent');
			}}
			sx={{ mt: 2 }}
		/>
	</Sidebar>
);

export default FilterPublicationSidebar;
