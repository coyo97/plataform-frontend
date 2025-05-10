import React, { useState } from 'react';
import {
	Dialog, DialogTitle, DialogContent,
	DialogActions, TextField, Button,
} from '@mui/material';

import { reportPublication } from '../../../../../async/services/publicationService';

interface Props {
	open         : boolean;
	publicationId: string;
	onClose(): void;
}

const ReportDialog: React.FC<Props> = ({ open, onClose, publicationId }) => {
	const [reason, setReason] = useState('');

	const send = async () => {
		if (!reason.trim()) return alert('Por favor, ingresa la razón');
		try {
			await reportPublication(publicationId, reason.trim());
			alert('Reporte enviado correctamente');
			setReason('');
			onClose();
		} catch (e) {
			console.error(e);
			alert('Error al reportar la publicación');
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Reportar publicación</DialogTitle>

			<DialogContent>
				<TextField
					autoFocus fullWidth multiline rows={4} margin="dense"
					label="Razón del reporte"
					value={reason}
					onChange={e => setReason(e.target.value)}
				/>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button color="secondary" onClick={send} disabled={!reason.trim()}>Enviar</Button>
			</DialogActions>
		</Dialog>
	);
};

export default React.memo(ReportDialog);

