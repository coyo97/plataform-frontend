import React, { useEffect, useState } from 'react';
import {
	Box,Button,Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { SidebarContainer } from './sidebars.styles';

import CreatePublicationForm
from '../createPublicationForm/CreatePublicationForm';
import { FormCard } from '../../createPublicationStyles';
import CreatePublicationDialog from '../CreatePublicationDialog';

import {
	fetchCareers, createPublication,
} from '../../../../../async/services/publicationService';

import { Career,Publication } from '../../../../../types/publication';

interface Props {
	onNew: (pub: Publication) => void;           // notifica a la Page/feed
}

const CreateSidebar: React.FC<Props> = ({ onNew }) => {
	/* ---------- estado ---------- */
// Estado para el modal
	const [dialogOpen, setDialogOpen] = useState(false);

	// Estado para las carreras
	const [careers, setCareers] = useState<Career[]>([]);

	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	// Envío real al backend
	const handleSubmit = async (fd: FormData) => {
		const pub = await createPublication(fd);
		onNew(pub);
		return pub;
	};

	return (
		<SidebarContainer>
			<Box sx={{ px: 1 }}>
				<Typography variant="subtitle1" fontWeight={600} gutterBottom>
					Crear publicación
				</Typography>

				<Button
					variant="contained"
					color="secondary"
					fullWidth
					onClick={() => setDialogOpen(true)}
				>
					Abrir formulario
				</Button>
			</Box>

			{/* Modal flotante */}
			<CreatePublicationDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				careers={careers}
				onNew={onNew}
				onSubmit={handleSubmit}
			/>
		</SidebarContainer>
	);
};

export default CreateSidebar;

