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

const ActionMenu: React.FC<ActionMenuProps> = ({
	isOwner,
	link,
	onEdit,
	onDelete,
	onReport,
	onSave,
	onClose
}) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			alert('📎 Enlace copiado');
		} catch {
			alert('Error al copiar el enlace');
		}
		onClose?.();
	};

	return (
		<StyledMenu
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open
			onClose={onClose}
		>
			{isOwner
				? [
					<MenuItem key="edit" onClick={() => { onEdit?.(); onClose?.(); }}>
						<ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
						<ListItemText primary="Editar" />
					</MenuItem>,
					<MenuItem key="delete" onClick={() => { onDelete?.(); onClose?.(); }}>
						<ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
						<ListItemText primary="Eliminar" />
					</MenuItem>,
				]
				: [
					<MenuItem key="save" onClick={() => { onSave?.(); onClose?.(); }}>
						<ListItemIcon><BookmarkBorderOutlinedIcon fontSize="small" /></ListItemIcon>
						<ListItemText primary="Guardar" />
					</MenuItem>,
					<MenuItem key="report" onClick={() => { onReport?.(); onClose?.(); }}>
						<ListItemIcon><ReportGmailerrorredOutlinedIcon fontSize="small" /></ListItemIcon>
						<ListItemText primary="Reportar" />
					</MenuItem>,
				]}

			<MenuItem key="copy" onClick={handleCopy}>
				<ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
				<ListItemText primary="Copiar enlace" />
			</MenuItem>
		</StyledMenu>
	);
};

export default ActionMenu;

