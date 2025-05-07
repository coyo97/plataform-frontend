import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	SidebarContainer,
	SidebarHeader,
	SidebarList,
	SidebarListItem,
	SidebarFooter,
	BackButton,
} from './sidebar.styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import FolderIcon from '@mui/icons-material/Folder';
import Escudo_Universidad_Autónoma_Tomás_Frías from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

interface SidebarProps {
	isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
	const navigate = useNavigate();

	return (
		<SidebarContainer style={{ display: isVisible ? 'block' : 'none' }}>
			<SidebarHeader variant="h6">Admin Panel</SidebarHeader>
			{/* Botón Volver */}
			<BackButton onClick={() => navigate('/plataform')}>Volver</BackButton>
			<SidebarList>
				<SidebarListItem>
					<Link to="/administrator">
						<DashboardIcon /> Dashboard
					</Link>
				</SidebarListItem>
				<SidebarListItem>
					<Link to="/administrator/users">
						<PeopleIcon /> Gestión de Usuarios
					</Link>
				</SidebarListItem>
				<SidebarListItem>
					<Link to="/administrator/roles">
						<AssignmentIndIcon /> Gestión de Roles
					</Link>
				</SidebarListItem>
				<SidebarListItem>
					<Link to="/administrator/moderator">
						<SecurityIcon /> Moderador IA
					</Link>
				</SidebarListItem>
				<SidebarListItem>
					<Link to="/administrator/center-alert">
						<NotificationsIcon /> Centro de alertas
					</Link>
				</SidebarListItem>
				<SidebarListItem>
					<Link to="/administrator/career">
						<SchoolIcon /> Carreras
					</Link>
				</SidebarListItem>
				<SidebarListItem>
					<Link to="/administrator/conf-file">
						<FolderIcon /> Configuración Archivos
					</Link>
				</SidebarListItem>
			</SidebarList>
			<SidebarFooter>
				<img
					src={Escudo_Universidad_Autónoma_Tomás_Frías}
					alt="Logo Universidad Autónoma Tomás Frías"
					style={{ width: '50px', marginBottom: '0.5rem' }}
				/>
				<div>&copy;2024 Universidad Autónoma Tomás Frías</div>
			</SidebarFooter>
		</SidebarContainer>
	);
};

export default Sidebar;

