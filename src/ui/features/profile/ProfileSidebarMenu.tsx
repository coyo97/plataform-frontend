// ui/features/profile/ProfileSidebarMenu.tsx
import React, { useEffect, useState } from 'react';
import {
	useMediaQuery,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Badge,
	Alert,
	Box,
} from '@mui/material';
import {
	Person as PersonIcon,
	Edit as EditIcon,
	Group as GroupIcon,
	Search as SearchIcon,
	Block as BlockIcon,
	PersonAdd as MailOutlineIcon,
} from '@mui/icons-material';

import Sidebar from '../../shared/organisms/sidebar/Sidebar';
import { breakPoints } from '../../../config/mq';

interface Props {
	open: boolean;
	onClose?: () => void;
	onSelect: (section: string) => void;
	selectedSection: string;
	pendingRequestsCount?: number;
	canEditProfile?: boolean;
}

const ProfileSidebarMenu: React.FC<Props> = ({
	open,
	onClose,
	onSelect,
	selectedSection,
	pendingRequestsCount = 0,
	canEditProfile = true,
}) => {
	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);

	// Flag persistido cuando el backend devolvió 403 en UpdateProfile (refuerzo)
	const [editForbidden, setEditForbidden] = useState<boolean>(() => {
		try {
			return localStorage.getItem('profile:update:forbidden') === '1';
		} catch {
			return false;
		}
	});

	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Escuchar eventos para reflejar cambios en caliente (por si 403 se dispara dentro del form)
	useEffect(() => {
		const onForbidden = () => setEditForbidden(true);
		const onAllowed = () => setEditForbidden(false);
		const onStorage = (e: StorageEvent) => {
			if (e.key === 'profile:update:forbidden') {
				setEditForbidden(e.newValue === '1');
			}
		};

		window.addEventListener('profile:update:forbidden' as any, onForbidden);
		window.addEventListener('profile:update:allowed' as any, onAllowed);
		window.addEventListener('storage', onStorage);
		return () => {
			window.removeEventListener('profile:update:forbidden' as any, onForbidden);
			window.removeEventListener('profile:update:allowed' as any, onAllowed);
			window.removeEventListener('storage', onStorage);
		};
	}, []);

	// Si desde props ya puede editar, levanta el bloqueo local
	useEffect(() => {
		if (canEditProfile) {
			setEditForbidden(false);
		}
	}, [canEditProfile]);

	const handleSelect = (value: string) => {
		onSelect(value);
		if (onClose) onClose();
	};

	// Permiso efectivo = permiso de props Y que no esté marcado forbidden por 403
	const effectiveCanEdit = !!canEditProfile && !editForbidden;

	const handleEditClick = () => {
		if (!effectiveCanEdit) {
			setErrorMsg('No tienes permisos para realizar esta acción.');
			return;
		}
		handleSelect('updateProfile');
	};

	return (
		<Sidebar
			open={open}
			onClose={onClose}
			variant={isMobile ? 'modal' : 'elevated'}
			width={isMobile ? 320 : 250}
			position="left"
			sticky={!isMobile}
			ariaLabel="Menú de perfil"
		>
			{errorMsg && (
				<Box sx={{ px: 2, pt: 2 }}>
					<Alert severity="warning" onClose={() => setErrorMsg(null)}>
						{errorMsg}
					</Alert>
				</Box>
			)}

			<List subheader={<ListSubheader component="div">Perfil</ListSubheader>} dense sx={{ pt: 0 }}>
				<ListItemButton
					selected={selectedSection === 'viewProfile'}
					onClick={() => handleSelect('viewProfile')}
				>
					<ListItemIcon><PersonIcon /></ListItemIcon>
					<ListItemText primary="Ver perfil" />
				</ListItemButton>

				<ListItemButton
					selected={selectedSection === 'updateProfile'}
					onClick={handleEditClick}
					aria-disabled={!effectiveCanEdit}
					sx={{
						...(!effectiveCanEdit
							? {
								opacity: 0.5,
								cursor: 'not-allowed',
								pointerEvents: 'auto',
							}
							: {}),
					}}
				>
					<ListItemIcon><EditIcon /></ListItemIcon>
					<ListItemText
						primary="Editar perfil"
						sx={!effectiveCanEdit ? { color: 'text.disabled' } : undefined}
					/>
				</ListItemButton>
			</List>

			<List subheader={<ListSubheader component="div">Amigos</ListSubheader>} dense>
				<ListItemButton
					selected={selectedSection === 'friendRequests'}
					onClick={() => handleSelect('friendRequests')}
				>
					<ListItemIcon>
						<Badge color="secondary" badgeContent={pendingRequestsCount} max={99}>
							<MailOutlineIcon />
						</Badge>
					</ListItemIcon>
					<ListItemText primary="Solicitudes" />
				</ListItemButton>

				<ListItemButton
					selected={selectedSection === 'friendsList'}
					onClick={() => handleSelect('friendsList')}
				>
					<ListItemIcon><GroupIcon /></ListItemIcon>
					<ListItemText primary="Lista de amigos" />
				</ListItemButton>

				<ListItemButton
					selected={selectedSection === 'userSearch'}
					onClick={() => handleSelect('userSearch')}
				>
					<ListItemIcon><SearchIcon /></ListItemIcon>
					<ListItemText primary="Buscar usuarios" />
				</ListItemButton>

				<ListItemButton
					selected={selectedSection === 'blockedUsersList'}
					onClick={() => handleSelect('blockedUsersList')}
				>
					<ListItemIcon><BlockIcon /></ListItemIcon>
					<ListItemText primary="Usuarios bloqueados" />
				</ListItemButton>
			</List>
		</Sidebar>
	);
};

export default ProfileSidebarMenu;

