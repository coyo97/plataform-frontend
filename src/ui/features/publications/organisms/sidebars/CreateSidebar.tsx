import React, { useEffect, useState } from 'react';
import {
	Box, IconButton, Collapse, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { SidebarContainer } from './sidebars.styles';

import CreatePublicationForm
from '../createPublicationForm/CreatePublicationForm';
import { FormCard } from '../../createPublicationStyles';

import {
	fetchCareers, createPublication,
	Career, Publication,
} from '../../../../../async/services/publicationService';

interface Props {
	onNew: (pub: Publication) => void;           // notifica a la Page/feed
}

const CreateSidebar: React.FC<Props> = ({ onNew }) => {
	/* ---------- estado ---------- */
	const [open   , setOpen]    = useState(false);
	const [careers, setCareers] = useState<Career[]>([]);

	/* ---------- carreras (una sola vez) ---------- */
	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	/* ---------- submit real ---------- */
	const handleSubmit = async (fd: FormData) => {
		const pub = await createPublication(fd);   // llamada al backend
		onNew(pub);                                // lo añade al feed
		return pub;
	};

	return (
		<SidebarContainer>
			{/* Cabecera plegable */}
			<Box sx={{
				display:'flex', alignItems:'center', justifyContent:'space-between',
				px: 1,
				}}>
				<Typography variant="subtitle1" fontWeight={600}>
					Crear publicación
				</Typography>

				<IconButton
					size="small"
					onClick={()=>setOpen(o=>!o)}
					sx={{
						transform : open ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform .25s',
					}}
				>
					<ExpandMoreIcon fontSize="small"/>
				</IconButton>
			</Box>
			{/* Formulario que se pliega */}
			<Collapse in={open} unmountOnExit>
				<FormCard elevation={0}>      {/*  ← tarjeta blanca */}
					<CreatePublicationForm
						careers   ={careers}
						onSubmit  ={handleSubmit}
						onCreated ={onNew}
					/>
				</FormCard>
			</Collapse>

			{/* — Aquí podrás añadir más widgets — */}
		</SidebarContainer>
	);
};

export default CreateSidebar;

