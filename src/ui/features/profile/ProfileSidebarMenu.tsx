// ui/features/profile/ProfileSidebarMenu.tsx
import React from 'react';
import { useMediaQuery, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Badge } from '@mui/material';
import {
	Person as PersonIcon,
	Edit as EditIcon,
	Group as GroupIcon,
	Search as SearchIcon,
	Block as BlockIcon,
	MailOutline as MailOutlineIcon,
} from '@mui/icons-material';

import Sidebar from '../../shared/organisms/sidebar/Sidebar';
import { breakPoints } from '../../../config/mq';

interface Props {
	open: boolean;
	onClose?: () => void;
	onSelect: (section: string) => void;
	selectedSection: string;
	pendingRequestsCount?: number;
}

const ProfileSidebarMenu: React.FC<Props> = ({
	open,
	onClose,
	onSelect,
	selectedSection,
	pendingRequestsCount = 0,
}) => {
	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);

	const handleSelect = (value: string) => {
		// Cambia de sección y cierra (asegura la “redirección” en tu vista)
		onSelect(value);
		if (onClose) onClose();
	};

	return (
		<Sidebar
			open={open}
			onClose={onClose}
			variant={isMobile ? 'modal' : 'elevated'}   // modal en móvil para cubrir header
			width={isMobile ? 320 : 250}
			position="left"
			sticky={!isMobile}
			ariaLabel="Menú de perfil"
		>
			{/* Sección PERFIL */}
			<List subheader={<ListSubheader component="div">Perfil</ListSubheader>} dense sx={{ pt: 0 }}>
				<ListItemButton selected={selectedSection === 'viewProfile'} onClick={() => handleSelect('viewProfile')}>
					<ListItemIcon><PersonIcon /></ListItemIcon>
					<ListItemText primary="Ver perfil" />
				</ListItemButton>

				<ListItemButton selected={selectedSection === 'updateProfile'} onClick={() => handleSelect('updateProfile')}>
					<ListItemIcon><EditIcon /></ListItemIcon>
					<ListItemText primary="Editar perfil" />
				</ListItemButton>
			</List>

			<List subheader={<ListSubheader component="div">Amigos</ListSubheader>} dense>
				<ListItemButton selected={selectedSection === 'friendRequests'} onClick={() => handleSelect('friendRequests')}>
					<ListItemIcon>
						<Badge color="secondary" badgeContent={pendingRequestsCount} max={99}>
							<MailOutlineIcon />
						</Badge>
					</ListItemIcon>
					<ListItemText primary="Solicitudes" />
				</ListItemButton>

				<ListItemButton selected={selectedSection === 'friendsList'} onClick={() => handleSelect('friendsList')}>
					<ListItemIcon><GroupIcon /></ListItemIcon>
					<ListItemText primary="Lista de amigos" />
				</ListItemButton>

				<ListItemButton selected={selectedSection === 'userSearch'} onClick={() => handleSelect('userSearch')}>
					<ListItemIcon><SearchIcon /></ListItemIcon>
		  <ListItemText primary="Buscar usuarios" />
				</ListItemButton>

				<ListItemButton selected={selectedSection === 'blockedUsersList'} onClick={() => handleSelect('blockedUsersList')}>
					<ListItemIcon><BlockIcon /></ListItemIcon>
					<ListItemText primary="Usuarios bloqueados" />
				</ListItemButton>
			</List>
		</Sidebar>
	);
};

export default ProfileSidebarMenu;

