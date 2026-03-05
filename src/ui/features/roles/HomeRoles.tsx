// src/ui/features/roles/HomeRoles.tsx
import React, { useState } from 'react';
import { Tabs, Tab, Box, useTheme, useMediaQuery } from '@mui/material';

import Text from '../../shared/atoms/typography/Text';
import SmartBox from '../../shared/atoms/box/SmartBox';

// Grillas
import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn    from '../../shared/atoms/grid/GridColumn';

import mq from '../../../config/mq';

import CreateRole            from './CreateRole';
import EditRole              from './EditRole';
import RolesList             from './RolesList';
import AssignRolesToUser     from './AssignRolesToUser';
import UserListWithRoles     from './UserListWithRoles';
import ActionManagement      from './ActionManagement';
import ModuleManagement      from './ModuleManagement';

// Claves de pestañas
type TabKey =
	| 'modules'
| 'actions'
| 'create'
| 'list'
| 'assign'
| 'users'
| 'edit';

// Orden maestro de tabs
const TAB_ORDER: TabKey[] = [
	'modules',
	'actions',
	'create',
	'list',
	'assign',
	'users',
	'edit',
];

// Metadatos de cada tab (label + render)
const TAB_CONFIG: Record<TabKey, { label: string; render: (ctx: { selectedRoleId: string | null, setSelectedRoleId: (id: string | null) => void, goTo: (key: TabKey) => void }) => React.ReactNode }> = {
	modules: { label: 'Gestión de Módulos', render: () => <ModuleManagement /> },
	actions: { label: 'Gestión de Acciones', render: () => <ActionManagement /> },
	create:  { label: 'Crear Rol',           render: () => <CreateRole /> },
	list:    {
		label: 'Lista de Roles',
		render: ({ setSelectedRoleId, goTo }) => (
			<RolesList
				onSelectRole={(roleId: string) => {
					setSelectedRoleId(roleId);
					goTo('edit');
				}}
			/>
		),
	},
	assign:  { label: 'Asignar Roles',       render: () => <AssignRolesToUser /> },
	users:   { label: 'Usuarios con Roles',  render: () => <UserListWithRoles /> },
	edit:    {
		label: '',
		render: ({ selectedRoleId }) =>
			selectedRoleId
				? <EditRole roleId={selectedRoleId} />
				: <Text colorKey="text.secondary">Seleccione un rol para editar</Text>,
	},
};

function a11yProps(index: number) {
	return {
		id: `roles-tab-${index}`,
		'aria-controls': `roles-tabpanel-${index}`,
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
			id={`roles-tabpanel-${index}`}
			aria-labelledby={`roles-tab-${index}`}
			style={{ width: '100%' }}
		>
			{!hidden && (
				<SmartBox column gap={2} sx={{ width: '100%', minWidth: 0 }}>
					{children}
				</SmartBox>
			)}
		</div>
	);
};

const HomeRoles: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(mq('sm', 'max'));

	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

	// índice actual de tab
	const [tabIndex, setTabIndex] = useState<number>(0);
	const goTo = (key: TabKey) => {
		const idx = TAB_ORDER.indexOf(key);
		setTabIndex(idx >= 0 ? idx : 0);
	};

	const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
		setTabIndex(newIndex);
	};

	return (
		<GridContainer
			variant="desktopFluid"
			columns={{ xs: 4, sm: 6, md: 12 }}
			style={{ rowGap: 12, padding: isMobile ? '1rem' : '2rem', backgroundColor: theme.palette.background.default }}
		>
			{/* Header de Tabs sticky */}
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
						value={tabIndex}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="auto"
						allowScrollButtonsMobile
						aria-label="Roles y Permisos (pestañas)"
						sx={{
							width: '100%',
							overflowX: 'auto',
							'& .MuiTabs-scrollButtons': { flex: '0 0 32px' },
						}}
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
					<TabPanel key={key} value={tabIndex} index={idx} keepMounted>
						{TAB_CONFIG[key].render({ selectedRoleId, setSelectedRoleId, goTo })}
					</TabPanel>
				))}
			</GridColumn>
		</GridContainer>
	);
};

export default HomeRoles;

