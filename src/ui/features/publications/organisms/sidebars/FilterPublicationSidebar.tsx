// ui/features/publications/organisms/sidebars/FilterPublicationSidebar.tsx
import React from 'react';
import Sidebar from '../../../../shared/organisms/sidebar/Sidebar';
import SectionTitle from '../../../../shared/atoms/titles/SectionTitle';
import AccordionSection from '../../../../shared/molecules/accordionSection/AccordionSection';
import GhostButton from '../../../../shared/atoms/buttons/ghostButton/GhostButton';
import { Career } from '../../../../../types/publication';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import CareerSelector from '../../../../shared/molecules/selector/CareerSelector';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';

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
		//header={<SectionTitle>Filtrar publicaciones</SectionTitle>}
		open={open}
		onClose={onClose}
		variant="flat"
	>
		<SmartBox column style={{ gap: '12px' }}>
			{/* ── Filtrado por carrera ─────────────────────────── */}
			<CareerSelector
				careers={careers}              // el mismo array que recibes
				value={selectedCareer}         // id seleccionado o ''
				variant="transparent"
				onChange={(id) => {
					setCareer(id);
					setFilter('career');
				}}
				dropdownMode="inline" // ✅ aquí es donde se usa, no en Sidebar
				// Opcionales
				// Deshabilita label porque ya lo da el Accordion
			/>
			{/* ── Ordenamiento ────────────────────────────────── */}
			<AccordionSection title="Ordenar">
				<SmartBox column gap="px8" >
					<FilledButton
						label="Más recientes"
						fullWidth
						variant={selectedFilter === 'mostRecent' && !selectedCareer ? 'contained' : 'text'}
						colorType="primary"
						onClick={() => setFilter('mostRecent')}
					>
						Más recientes
					</FilledButton>
					<FilledButton
						label="Más gustadas"
						fullWidth
						variant={selectedFilter === 'mostLiked' ? 'contained' : 'text'}
						colorType="secondary"
						onClick={() => setFilter('mostLiked')}
					>
						Más gustadas
						</FilledButton>
					<FilledButton
						label="Más comentadas"
						fullWidth
						variant={selectedFilter === 'mostCommented' ? 'contained' : 'text'}
						colorType="primary"
						onClick={() => setFilter('mostCommented')}
					>
						Más comentadas
						</FilledButton>
					{/* ── Ver todas ───────────────────────────────────── */}
					<FilledButton
						label="Ver todas"
						fullWidth
						variant={selectedFilter === 'mostRecent' && selectedCareer === '' ? 'contained' : 'text'}
						colorType="secondary"
						onClick={() => {
							setCareer('');
							setFilter('mostRecent');
						}}
					>
						Ver todas
						</FilledButton>
				</SmartBox>
			</AccordionSection>
		</SmartBox>
	</Sidebar>
);

export default FilterPublicationSidebar;
