import React, { useState } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import HelpFeed from './organisms/HelpFeed';
import CreateHelpSidebar from './organisms/CreateHelpSidebar';
import HelpLayout from './templetes/HelpLayout';
import { useHelpFeed } from './hook/useHelpFeed';
import { AcademicHelp } from '../../../types/academicHelp';
import HelpFilterSidebar from './organisms/HelpFilterSidebar';
import Loader from '../../shared/atoms/feedback/loader/Loader';
import { styles } from './homeAcademicHelp.styles';
import IconButton from '../../shared/atoms/buttons/iconButton/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TuneIcon from '@mui/icons-material/Tune';
import {
  useTheme,
  useMediaQuery,
} from '@mui/material';
const HomeAcademicHelp = () => {
	const { helps, setHelps, loading, setFilters, filters } = useHelpFeed();

	/* sidebars */
	const [createOpen, setCreateOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	/* snackbar */
	const [snack, setSnack] = useState(false);
	// Cuando se crea una nueva ayuda
	const handleNew = (h: AcademicHelp) => {
		setHelps(prev => [...prev, h]);
		setSnack(true);
	};
const openCreateSidebar = () => {
  setFilterOpen(false);
  setCreateOpen(true);
};

const openFilterSidebar = () => {
  setCreateOpen(false);
  setFilterOpen(true);
};

return (
    <>
      <HelpLayout>
        {/* Mobile buttons */}
        {isMobile && (
          <Box sx={styles.mobileActions}>
<IconButton onClick={openCreateSidebar} ariaLabel="Abrir creador de ayuda">
  <AddCircleIcon />
</IconButton>
<IconButton onClick={openFilterSidebar} ariaLabel="Abrir filtros de ayuda">
  <TuneIcon />
</IconButton>

          </Box>
        )}

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
          onApply={f => {
            setFilters(f);
            setFilterOpen(false);
          }}
          onClear={() => setFilters({})}
          onClose={() => setFilterOpen(false)}
        />
      </HelpLayout>

      {/* Snackbar de confirmación */}
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          ¡Ayuda publicada con éxito!
        </Alert>
      </Snackbar>
    </>
  );
};

export default HomeAcademicHelp;
