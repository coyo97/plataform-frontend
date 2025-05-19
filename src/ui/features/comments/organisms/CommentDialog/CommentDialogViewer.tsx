import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Typography,
	Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CommentList from '../CommentList/CommentList';

interface Props {
	open: boolean;
	publicationId: string;
	onClose: () => void;
}

const CommentDialogViewer: React.FC<Props> = ({ open, onClose, publicationId }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: {
					borderRadius: 3,
					overflow: 'hidden',
					maxHeight: '90vh', // permite scroll si hay muchos comentarios
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<DialogTitle
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}
			>
				<Typography variant="h6">Comentarios</Typography>
				<IconButton onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ px: 2, pt: 0, overflowY: 'auto', flex: 1 }}>
				<CommentList publicationId={publicationId} />
			</DialogContent>

			<DialogActions sx={{ px: 2, pb: 2 }}>
				<Button onClick={onClose} variant="outlined" fullWidth>
					Cerrar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CommentDialogViewer;

