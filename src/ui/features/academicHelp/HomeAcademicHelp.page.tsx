import React, { useState } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import HelpFeed from './organisms/HelpFeed';
import CreateHelpSidebar from './organisms/CreateHelpSidebar';
import { useHelpFeed } from './hook/useHelpFeed';
import { AcademicHelp } from '../../../types/academicHelp';
import HelpFilterSidebar from './organisms/HelpFilterSidebar';
import Loader from '../../shared/atoms/feedback/loader/Loader';
import { styles } from './homeAcademicHelp.styles';
import IconButton from '../../shared/atoms/buttons/iconButton/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TuneIcon from '@mui/icons-material/Tune';
import { useTheme, useMediaQuery } from '@mui/material';
import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn from '../../shared/atoms/grid/GridColumn';
import Header from '../../shared/organisms/header/Header';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { NavLink,navLinks } from '../../../config/navLinks';
const HomeAcademicHelp = () => {
	const { helps, setHelps, loading, setFilters, filters } = useHelpFeed();
	const [createOpen, setCreateOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [snack, setSnack] = useState(false);
	const handleNew = (h: AcademicHelp) => {
		setHelps((prev) => [...prev, h]);
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
			<Header
				logoSrc={Logo}
				variant="gradient"
				navLinks={navLinks}
				userRole="student"
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
			<GridContainer variant="desktopFixed"  style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}
				columns={{ xs: 4, sm: 6, md: 12 }} >
				{/* Mobile actions */}
				{isMobile && (
					<GridColumn span={12}>
						<Box sx={styles.mobileActions}>
							<IconButton
								onClick={openCreateSidebar}
								ariaLabel="Abrir creador de ayuda"
							>
								<AddCircleIcon />
							</IconButton>
							<IconButton
								onClick={openFilterSidebar}
								ariaLabel="Abrir filtros de ayuda"
							>
								<TuneIcon />
							</IconButton>
						</Box>
					</GridColumn>
				)}
				{/* Col 1 ─ Crear ayuda */}
				{isMobile ? (
					<GridColumn span={12}>
						<CreateHelpSidebar
							open={createOpen}
							onClose={() => setCreateOpen(false)}
							onNew={handleNew}
						/>
					</GridColumn>
				) : (
					<GridColumn span={3}>
						<CreateHelpSidebar           open={createOpen}
							onClose={() => setCreateOpen(false)}
							onNew={handleNew} />
					</GridColumn>
				)}
				{/* Col 2 ─ Feed */}
				<GridColumn span={isMobile ? 12 : 6}>
					{loading ? <Loader /> : <HelpFeed list={helps} />}
				</GridColumn>
				{/* Col 3 ─ Filtros */}
				{isMobile ? (
					<GridColumn span={12}>
						<HelpFilterSidebar
							open={filterOpen}
							current={filters ?? {}}
							onApply={(f) => {
								setFilters(f);
								setFilterOpen(false);
							}}
							onClear={() => setFilters({})}
							onClose={() => setFilterOpen(false)}
						/>
					</GridColumn>
				) : (
					<GridColumn span={3}>
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
					</GridColumn>
				)}
			</GridContainer>
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
