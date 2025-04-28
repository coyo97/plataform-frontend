// src/ui/components/publications/CreatePublication.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
	FormCard, FormHeader, FormBody, FormActions,
	StyledTextField, StyledSelect, StyledButton,
} from './createPublicationStyles';

import Escudo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

import {
	Career, Publication,
	fetchCareers, createPublication,
} from '../../../async/services/publicationService';

interface Props {
	onPublicationCreated: (p: Publication) => void;
}

const CreatePublication: React.FC<Props> = ({ onPublicationCreated }) => {
	const [title, setTitle]     = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags]       = useState('');
	const [file, setFile]       = useState<File | null>(null);

	const [careers, setCareers] = useState<Career[]>([]);
	const [careerId, setCareer] = useState('');
	const [open, setOpen]       = useState(false);

	const navigate = useNavigate();

	//*cargar carreras con caché
	useEffect(() => {
		fetchCareers()
		.then((c) => {
			setCareers(c);
			if (c.length === 1) setCareer(c[0]._id);
		})
		.catch(console.error);
	}, []);

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) =>
		e.target.files && setFile(e.target.files[0]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('title', title);
		fd.append('content', content);
		if (file)             fd.append('file', file);
		fd.append(
			'tags',
			JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)),
		);
		if (careerId)         fd.append('careerId', careerId);

		try {
			const pub = await createPublication(fd);
			onPublicationCreated(pub);

			alert('Publicación creada con éxito');
			/* reset */
			setTitle(''); setContent(''); setTags('');
			setFile(null); setCareer(''); setOpen(false);
			// navigate('/publications');
		} catch (err: any) {
			const msg = err?.message ||
				'Error al crear la publicación';
			alert(msg);
			console.error(err);
		}
	};

	/* ───────────────── UI */
	return (
		<FormCard>
			<FormHeader
				avatar={<img src={Escudo} width={48} alt="UATF" />}
				title="Crear publicación"
				action={
					<IconButton onClick={() => setOpen(v => !v)}>
						<ExpandMoreIcon
							sx={{
								transform : open ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform .25s',
							}}
						/>
					</IconButton>
				}
			/>

			<Collapse in={open}>
				<form onSubmit={handleSubmit}>
					<FormBody>
						<StyledTextField label="Título"       value={title}   onChange={e=>setTitle(e.target.value)}   required />
						<StyledTextField label="Contenido"    value={content} onChange={e=>setContent(e.target.value)} multiline rows={4} required />
						<StyledTextField label="Etiquetas (,)" value={tags}   onChange={e=>setTags(e.target.value)}   />

						<input type="file" onChange={handleFile} />

						{careers.length > 0 && (
							<StyledSelect
								native
								value={careerId}
								onChange={e => setCareer(e.target.value as string)}
							>
								<option value="">Selecciona carrera</option>
								{careers.map(c => (
									<option key={c._id} value={c._id}>{c.name}</option>
								))}
							</StyledSelect>
						)}
					</FormBody>

					<FormActions>
						<StyledButton variant="outlined" onClick={() => setOpen(false)}>Cancelar</StyledButton>
						<StyledButton variant="contained" color="secondary" type="submit">
							Publicar
						</StyledButton>
					</FormActions>
				</form>
			</Collapse>
		</FormCard>
	);
};

export default CreatePublication;

