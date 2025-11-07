// src/ui/features/groups/components/GroupMemberActionsMenu.tsx
import React, { useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SecurityIcon from '@mui/icons-material/Security';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';

type Props = {
	// permisos de quien usa la UI
	canManageMembers: boolean;
	canManageAdmins: boolean;

	// estado del miembro target
	isCreator: boolean;
	isAdmin: boolean;

	// callbacks (promesas para poder bloquear mientras corre)
	onRemove: () => Promise<void> | void;
	onGrantAdmin: () => Promise<void> | void;
	onRevokeAdmin: () => Promise<void> | void;

	// opcional: densidad o tamaños
	dense?: boolean;
};

const GroupMemberActionsMenu: React.FC<Props> = ({
	canManageMembers,
	canManageAdmins,
	isCreator,
	isAdmin,
	onRemove,
	onGrantAdmin,
	onRevokeAdmin,
	dense = true,
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const [busy, setBusy] = useState<'remove' | 'grant' | 'revoke' | null>(null);

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
	const handleClose = () => !busy && setAnchorEl(null);

	const canRemove = canManageMembers && !isCreator; // nunca quitar al creador
	const canToggleAdmin = canManageAdmins; // solo creador puede dar/revocar admin

	const adminActionLabel = useMemo(() => (isAdmin ? 'Revocar admin' : 'Hacer admin'), [isAdmin]);
	const AdminIcon = isAdmin ? RemoveModeratorIcon : SecurityIcon;

	const run = async (which: 'remove' | 'grant' | 'revoke', fn: () => Promise<void> | void) => {
		try {
			setBusy(which);
			await fn();
			setAnchorEl(null);
		} finally {
			setBusy(null);
		}
	};

	// Si no tiene permisos de nada, muestra solo un menú “informativo”
	if (!canManageMembers && !canManageAdmins) {
		return (
			<Tooltip title="Sin permisos para gestionar este miembro">
				<span>
					<IconButton size="small" aria-label="Acciones" disabled>
						<MoreVertIcon fontSize="small" />
					</IconButton>
				</span>
			</Tooltip>
		);
	}

	return (
		<>
			<IconButton
				size="small"
				aria-label="Más acciones"
				aria-controls={open ? 'member-actions-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleOpen}
			>
				<MoreVertIcon fontSize="small" />
			</IconButton>

			<Menu
				id="member-actions-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				keepMounted
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{/* Alternar admin (solo creador) */}
				<MenuItem
					dense={dense}
					disabled={!canToggleAdmin || busy !== null}
					onClick={() =>
						run(isAdmin ? 'revoke' : 'grant', isAdmin ? onRevokeAdmin : onGrantAdmin)
					}
				>
					<ListItemIcon>
						{busy === 'grant' || busy === 'revoke' ? (
							<CircularProgress size={18} />
						) : (
							<AdminIcon fontSize="small" />
						)}
					</ListItemIcon>
					<ListItemText>{adminActionLabel}</ListItemText>
				</MenuItem>

				<Divider />

				{/* Quitar del grupo */}
				<MenuItem
					dense={dense}
					disabled={!canRemove || busy !== null}
					onClick={() => run('remove', onRemove)}
					sx={(t) => ({ color: canRemove ? t.palette.error.main : undefined })}
				>
					<ListItemIcon>
						{busy === 'remove' ? (
							<CircularProgress size={18} />
						) : (
							<DeleteOutlineIcon
								fontSize="small"
								color={canRemove ? 'error' : undefined}
							/>
						)}
					</ListItemIcon>
					<ListItemText>Quitar</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
};

export default GroupMemberActionsMenu;

