import React, { useState } from 'react';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import RolesList from './RolesList';
import AssignRolesToUser from './AssignRolesToUser';
import UserListWithRoles from './UserListWithRoles';
import ActionManagement from './ActionManagement';
import ModuleManagement from './ModuleManagement';

function TabPanel(props: any) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: any) {
	return {
		id: `tab-${index}`,
		'aria-controls': `tabpanel-${index}`,
	};
}

const HomeRoles: React.FC = () => {
	const [value, setValue] = useState(0);
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detecta pantallas móviles

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box
			sx={{
				width: '100%',
				padding: isMobile ? '1rem' : '2rem',
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,
			}}
		>
			<Tabs
				value={value}
				onChange={handleChange}
				variant={isMobile ? 'scrollable' : 'standard'} // Habilita scroll en móvil
				scrollButtons={isMobile ? 'auto' : undefined} // Botones automáticos para scroll
				centered={!isMobile} // Centrado solo en pantallas grandes
			>
				<Tab label="Gestión de Módulos" {...a11yProps(0)} />
				<Tab label="Gestión de Acciones" {...a11yProps(1)} />
				<Tab label="Crear Rol" {...a11yProps(2)} />
				<Tab label="Lista de Roles" {...a11yProps(3)} />
				<Tab label="Asignar Roles" {...a11yProps(4)} />
				<Tab label="Usuarios con Roles" {...a11yProps(5)} />
				<Tab label="Editar Roles" {...a11yProps(6)} />
			</Tabs>
			<TabPanel value={value} index={0}>
				<ModuleManagement />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ActionManagement />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<CreateRole />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<RolesList
					onSelectRole={(roleId: string) => {
						setSelectedRoleId(roleId);
						setValue(6); // Cambiar al TabPanel de edición
					}}
				/>
			</TabPanel>
			<TabPanel value={value} index={4}>
				<AssignRolesToUser />
			</TabPanel>
			<TabPanel value={value} index={5}>
				<UserListWithRoles />
			</TabPanel>
			<TabPanel value={value} index={6}>
				{selectedRoleId ? (
					<EditRole roleId={selectedRoleId} />
				) : (
					<div>Seleccione un rol para editar</div>
				)}
			</TabPanel>
		</Box>
	);
};

export default HomeRoles;

