import React, { useState } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import HelpFeed from './organisms/HelpFeed';
import CreateHelpSidebar from './organisms/CreateHelpSidebar';
import HelpLayout from './templetes/HelpLayout';
import { useHelpFeed } from './hook/useHelpFeed';
import { AcademicHelp } from '../../../types/academicHelp';
import HelpFilterSidebar from './organisms/HelpFilterSidebar';
import Loader from '../../shared/atoms/feedback/loader/Loader';

const HomeAcademicHelp = () => {
	const { helps, setHelps, loading, setFilters, filters } = useHelpFeed();

	/* sidebars */
	const [createOpen, setCreateOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(true);

	/* snackbar */
	const [snack, setSnack] = useState(false);
	// Cuando se crea una nueva ayuda
	const handleNew = (h: AcademicHelp) => {
		setHelps(prev => [...prev, h]);
		setSnack(true);
	};

	return (
		<>
			<HelpLayout>
				{/* Col 1 ─ Crear ayuda */}
				<CreateHelpSidebar
					open={createOpen}
					onClose={() => setCreateOpen(false)}
					onNew={handleNew}
				/>

				{/* Col 2 ─ Feed */}
				<Box sx={{ width: '100%' }}>
					{loading ? <Loader /> : <HelpFeed list={helps} />}
				</Box>

				{/* Col 3 ─ Filtros */}
				<HelpFilterSidebar
					open={filterOpen}
					current={filters ?? {}}
					onApply={f=>{ setFilters(f); setFilterOpen(false);} }
					onClear={()=>setFilters({})}
					onClose={()=>setFilterOpen(false)}
				/>
			</HelpLayout>

			{/* Snackbar de confirmación */}
			<Snackbar
				open={snack}
				autoHideDuration={3000}
				onClose={() => setSnack(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert severity="success" variant="filled">¡Ayuda publicada con éxito!</Alert>
			</Snackbar>
		</>	
	);
};

export default HomeAcademicHelp;

