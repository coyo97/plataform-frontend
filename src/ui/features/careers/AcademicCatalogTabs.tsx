// src/ui/features/careers/AcademicCatalogTabs.tsx
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

// Secciones
import CareerManager from './CareerManager';
import FacultyManager from './FacultyManager';
import CycleManager from './CycleManager';
import SubjectManager from './SubjectManager';
import UnitManager from './UnitManager';
import AccessPolicyManager from '../access-policies/AccessPolicyManager';

// Grillas
import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn    from '../../shared/atoms/grid/GridColumn';

// Claves de pestañas (query ?tab=)
type TabKey = 'carreras' | 'facultades' | 'ciclos' | 'materias' | 'unidades' | 'politicas';

// IMPORTANTE: El orden aquí define índice y URL (?tab=)
const TAB_ORDER: TabKey[] = ['facultades', 'carreras', 'ciclos', 'materias', 'unidades', 'politicas'];

// Metadatos por tab
const TAB_CONFIG: Record<TabKey, { label: string; render: () => React.ReactNode }> = {
	facultades: { label: 'Facultades', render: () => <FacultyManager /> },
	carreras:   { label: 'Carreras',   render: () => <CareerManager /> },
	ciclos:     { label: 'Ciclos',     render: () => <CycleManager /> },
	materias:   { label: 'Materias',   render: () => <SubjectManager /> },
	unidades:   { label: 'Unidades',   render: () => <UnitManager /> },
	politicas:  { label: 'Políticas de Acceso', render: () => <AccessPolicyManager /> },
};

function a11yProps(index: number) {
	return {
		id: `catalogo-tab-${index}`,
		'aria-controls': `catalogo-tabpanel-${index}`,
	} as const;
}

const TabPanel: React.FC<{
	children?: React.ReactNode;
	value: number;
	index: number;
	keepMounted?: boolean;
}> = ({ children, value, index, keepMounted = true }) => {
	const hidden = value !== index;
	if (!keepMounted && hidden) return null;
	return (
		<div
			role="tabpanel"
			hidden={hidden}
			id={`catalogo-tabpanel-${index}`}
			aria-labelledby={`catalogo-tab-${index}`}
			style={{ width: '100%' }}
		>
			{!hidden && <Box sx={{ pt: 2 }}>{children}</Box>}
		</div>
	);
};

const AcademicCatalogTabs: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Lee ?tab= de la URL; si no existe, usa el primero de TAB_ORDER
	const tabParamRaw = (searchParams.get('tab') as TabKey) || TAB_ORDER[0];
	const currentIndex = Math.max(0, TAB_ORDER.indexOf(tabParamRaw));

	const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
		const nextKey = TAB_ORDER[newIndex] ?? TAB_ORDER[0];
		const next = new URLSearchParams(searchParams);
		next.set('tab', nextKey);
		setSearchParams(next, { replace: false });
	};

	return (
		<GridContainer variant="desktopFluid" columns={{ xs: 4, sm: 6, md: 12 }} style={{ rowGap: 12 }}>
			{/* Header de Tabs sticky (ocupa todo el ancho) */}
			<GridColumn span={{ xxs: 4, sm: 6, md: 12 }}>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						position: 'sticky',
						top: 0,
						zIndex: 1,
						bgcolor: 'background.paper',
					}}
				>
					<Tabs
						value={currentIndex}
						onChange={handleChange}
						variant="scrollable"
						allowScrollButtonsMobile
						aria-label="Catálogo Académico (pestañas)"
					>
						{TAB_ORDER.map((key, idx) => (
							<Tab key={key} label={TAB_CONFIG[key].label} {...a11yProps(idx)} />
						))}
					</Tabs>
				</Box>
			</GridColumn>

			{/* Panel activo (ocupa todo el ancho) */}
			<GridColumn span={{ xxs: 4, sm: 6, md: 12 }}>
				{TAB_ORDER.map((key, idx) => (
					<TabPanel key={key} value={currentIndex} index={idx} keepMounted>
						{TAB_CONFIG[key].render()}
					</TabPanel>
				))}
			</GridColumn>
		</GridContainer>
	);
};

export default AcademicCatalogTabs;

