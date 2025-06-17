import React, { useState } from 'react';
import {
	Tabs,
	Tab,
	useTheme,
	useMediaQuery,
} from '@mui/material';

import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import mq from '../../../config/mq';

import CreateRole from './CreateRole';
import EditRole from './EditRole';
import RolesList from './RolesList';
import AssignRolesToUser from './AssignRolesToUser';
import UserListWithRoles from './UserListWithRoles';
import ActionManagement from './ActionManagement';
import ModuleManagement from './ModuleManagement';

function TabPanel({ children, value, index, ...other }: any) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{
        flex: '1 1 100%',   // ⬅️ puede crecer y encogerse
        width: '100%',
        minWidth: 0,        // ⬅️ PERMITE encogerse
        boxSizing: 'border-box',
      }}
    >
      {value === index && (
        <SmartBox
          column
          gap={2}
          sx={{
            flex: '1 1 auto', // igual de elástico
            width: '100%',
            minWidth: 0,
          }}
        >
          {children}
        </SmartBox>
      )}
    </div>
  );
}



function a11yProps(index: number) {
	return {
		id: `tab-${index}`,
		'aria-controls': `tabpanel-${index}`,
	};
}

const HomeRoles: React.FC = () => {
	const [value, setValue] = useState(0);
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(mq('sm', 'max'));

	const handleChange = (_: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<SmartBox
  sx={{
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,        // ⬅️ la clave
    overflowX: 'hidden',
    padding: isMobile ? '1rem' : '2rem',
    backgroundColor: theme.palette.background.default,
  }}
		>
			{/* Tabs siempre scrollables */}
			<Tabs
				value={value}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons="auto"
				allowScrollButtonsMobile        // MUI v5.11+
				sx={{
					width: '100%',
					overflowX: 'auto',
					'& .MuiTabs-scrollButtons': { flex: '0 0 32px' },
				}}
			>
				<Tab label="Gestión de Módulos" {...a11yProps(0)} />
				<Tab label="Gestión de Acciones" {...a11yProps(1)} />
				<Tab label="Crear Rol" {...a11yProps(2)} />
				<Tab label="Lista de Roles" {...a11yProps(3)} />
				<Tab label="Asignar Roles" {...a11yProps(4)} />
				<Tab label="Usuarios con Roles" {...a11yProps(5)} />
				<Tab label="Editar Roles" {...a11yProps(6)} />
			</Tabs>

			{/* TabPanel contenedor 100 % */}
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
						setValue(6);
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
					<Text colorKey="text.secondary">Seleccione un rol para editar</Text>
				)}
			</TabPanel>
		</SmartBox>
	);

};

export default HomeRoles;

