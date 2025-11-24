// src/ui/shared/molecules/actionMenu/ActionMenu.tsx
import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import LinkIcon from '@mui/icons-material/Link';

import { ActionMenuProps } from './actionMenu.types';
import { StyledMenu } from './actionMenu.styles';
import { getPermissionMessage } from '../../messages/permissionMessages';
import type { PermissionMessageKey } from '../../messages/permissionMessages';

const ActionMenu: React.FC<ActionMenuProps> = ({
	isOwner,
	link,
	onEdit,
	onDelete,
	onReport,
	onSave,
	onClose,
	onPermissionDenied,
	canEdit = true,
	canDelete = true,
	canSave = true,
	canReport = true,
}) => {
	const deny = (type: PermissionMessageKey) => {
		const msg = getPermissionMessage(type);
		onPermissionDenied?.(msg);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			onPermissionDenied?.('📎 Enlace copiado');
		} catch {
			onPermissionDenied?.('No se pudo copiar el enlace.');
		}
		onClose?.();
	};

	const handleEditClick = () => {
		if (!canEdit) {
			deny('updateDenied');
			return;
		}
		onEdit?.();
		onClose?.();
	};

	const handleDeleteClick = () => {
		if (!canDelete) {
			deny('deleteDenied');
			return;
		}
		onDelete?.();
		onClose?.();
	};

	const handleSaveClick = () => {
		if (!canSave) {
			deny('genericDenied');
			return;
		}
		onSave?.();
		onClose?.();
	};

	const handleReportClick = () => {
		if (!canReport) {
			deny('reportDenied');
			return;
		}
		onReport?.();
		onClose?.();
	};

	const disabledStyle = {
		opacity: 0.5,
		cursor: 'not-allowed',
		pointerEvents: 'auto' as const,
	};

	// Usamos un anchorEl válido para que MUI no se queje
	const defaultAnchorEl =
		typeof document !== 'undefined' ? (document.body as HTMLElement) : null;

	return (
		<StyledMenu
			anchorEl={defaultAnchorEl}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open
			onClose={onClose}
		>
			{isOwner && (
				<MenuItem
					key="edit"
					onClick={handleEditClick}
					aria-disabled={!canEdit}
					sx={!canEdit ? disabledStyle : undefined}
				>
					<ListItemIcon>
						<EditOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Editar" />
				</MenuItem>
			)}

			{isOwner && (
				<MenuItem
					key="delete"
					onClick={handleDeleteClick}
					aria-disabled={!canDelete}
					sx={!canDelete ? disabledStyle : undefined}
				>
					<ListItemIcon>
						<DeleteOutlineIcon fontSize="small" color="error" />
					</ListItemIcon>
					<ListItemText primary="Eliminar" />
				</MenuItem>
			)}

			{!isOwner && (
				<MenuItem
					key="save"
					onClick={handleSaveClick}
					aria-disabled={!canSave}
					sx={!canSave ? disabledStyle : undefined}
				>
					<ListItemIcon>
						<BookmarkBorderOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Guardar" />
				</MenuItem>
			)}

			{!isOwner && (
				<MenuItem
					key="report"
					onClick={handleReportClick}
					aria-disabled={!canReport}
					sx={!canReport ? disabledStyle : undefined}
				>
					<ListItemIcon>
						<ReportGmailerrorredOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Reportar" />
				</MenuItem>
			)}

			<MenuItem key="copy" onClick={handleCopy}>
				<ListItemIcon>
					<LinkIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText primary="Copiar enlace" />
			</MenuItem>
		</StyledMenu>
	);
};

export default ActionMenu;

