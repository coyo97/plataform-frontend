import React, { useState } from 'react';
import axios from 'axios';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from '@mui/material';
import getEnvVariables from '../../../config/configEnvs';

interface ReportDialogProps {
	open: boolean;
	onClose: () => void;
	publicationId: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({ open, onClose, publicationId }) => {
	const [reportReason, setReportReason] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();

	const reportPublication = async () => {
		if (!reportReason) {
			alert('Por favor, ingresa la razón del reporte.');
			return;
		}

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/publications/${publicationId}/report`,
				{ reason: reportReason },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Reporte enviado correctamente');
			onClose();
			setReportReason('');
		} catch (error) {
			console.error('Error al reportar la publicación:', error);
			alert('Error al reportar la publicación');
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Reportar Publicación</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Razón del reporte"
					type="text"
					fullWidth
					multiline
					rows={4}
					variant="outlined"
					value={reportReason}
					onChange={(e) => setReportReason(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button onClick={reportPublication} color="secondary">
					Enviar Reporte
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default React.memo(ReportDialog);

