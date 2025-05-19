import React, { useState } from 'react';
import {
	Dialog, DialogTitle, DialogContent,
	DialogActions, Button, Box
} from '@mui/material';
import TextField from '../../../../shared/atoms/textFields/TextField';
import InfoTooltip from '../../../../shared/atoms/tooltips/infoTooltip/InfoTooltip';

interface Props {
	open: boolean;
	title: string;
	initial?: string;
	onClose: () => void;
	/** Debe devolver void | Promise<void> */
	onSave: (text: string) => void | Promise<void>;
}

const CommentModal: React.FC<Props> = ({
	open, title, initial = '',
	onClose, onSave,
}) => {
	const [text, setText] = useState(initial);

	const handleSave = async () => {
		await onSave(text.trim());
		setText('');               // limpia si el padre no lo hace
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
					<TextField
						label="Comentario"
						value={text}
						onChange={setText}
						placeholder="Escribe tu comentario…"
						error={text.length > 500}
						helperText={text.length > 500 ? 'Máximo 500 caracteres' : ''}
					/>
					<InfoTooltip
						content="Puedes escribir hasta 500 caracteres, por favor se respetuoso."
						position="right"
						size="small"
					/>
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button
					variant="contained"
					color="secondary"
					disabled={!text.trim() || text.length > 500}
					onClick={handleSave}
				>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CommentModal;

