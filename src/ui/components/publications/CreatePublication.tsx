import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Collapse, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import getEnvVariables from '../../../config/configEnvs';
import {
	FormContainer,
	InputField,
	TextArea,
	SelectField,
	FileInput,
	SubmitButton,
	FormTitle,
} from './createPublicationStyles';
import Escudo_Universidad_Autónoma_Tomás_Frías from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

interface Career {
	_id: string;
	name: string;
}

const CreatePublication: React.FC = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [careers, setCareers] = useState<Career[]>([]);
	const [selectedCareer, setSelectedCareer] = useState<string>('');
	const [showForm, setShowForm] = useState(false); // Control de visibilidad del formulario
	const navigate = useNavigate();

	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchCareers = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`${HOST}${SERVICE}/careers`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCareers(response.data.careers);
				if (response.data.careers.length === 1) {
					setSelectedCareer(response.data.careers[0]._id);
				}
			} catch (error) {
				console.error('Error fetching careers:', error);
			}
		};

		fetchCareers();
	}, [HOST, SERVICE]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('title', title);
		formData.append('content', content);
		if (file) {
			formData.append('file', file);
		}
		const tagsArray = tags.split(',').map(tag => tag.trim());
		formData.append('tags', JSON.stringify(tagsArray));

		if (selectedCareer) {
			formData.append('careerId', selectedCareer);
		}

		try {
			const token = localStorage.getItem('token');
			await axios.post(`${HOST}${SERVICE}/publications`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			alert('Publicación creada con éxito');
			navigate('/publications');
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message || 'Error al crear la publicación';
				// Mostrar mensaje de advertencia si la imagen es inapropiada
				if (errorMessage === 'Contenido inapropiado detectado en la imagen') {
					alert('La imagen contiene contenido inapropiado. Por favor, elige otra imagen.');
				} else {
					alert(errorMessage);
				}
			} else {
				alert('Ocurrió un error desconocido al crear la publicación');
			}
			console.error('Error al crear la publicación:', error);
		}
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexDirection: 'column' }}>
			{/* Contenedor del logo y botón */}
			<Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 600, mb: 2, mt: 2 }}>
				{/* Logo de la universidad */}
				<Box component="img" src={Escudo_Universidad_Autónoma_Tomás_Frías} alt="Logo Universidad" sx={{ width: 80, height: 80, mr: 2 }} />

				{/* Botón para abrir el formulario */}
				<Button
					variant="contained"
					color="primary"
					onClick={() => setShowForm(!showForm)}
					endIcon={<ExpandMore />}
					sx={{
						flex: 1,
						padding: '15px',
						fontSize: '20px',
						backgroundColor: '#3f51b5',
						'&:hover': { backgroundColor: '#303f9f' },
						mb: 2, // Ajuste de margen inferior para más espacio
					}}
				>
					Publicar
				</Button>
			</Box>

			{/* Formulario que se desliza */}
			<Collapse in={showForm} timeout="auto" unmountOnExit>
				<FormContainer onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600 }}>
					<FormTitle>Crear Publicación</FormTitle>
					<InputField
						type="text"
						placeholder="Título"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<TextArea
						placeholder="Contenido"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
					></TextArea>
					<InputField
						type="text"
						placeholder="Etiquetas (separadas por comas)"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
					<FileInput type="file" onChange={handleFileChange} />
					{careers.length > 0 && (
						<SelectField
							value={selectedCareer}
							onChange={(e) => setSelectedCareer(e.target.value)}
						>
							<option value="">Selecciona una carrera (opcional)</option>
							{careers.map(career => (
								<option key={career._id} value={career._id}>
									{career.name}
								</option>
							))}
						</SelectField>
					)}
					<SubmitButton type="submit">Crear Publicación</SubmitButton>
				</FormContainer>
			</Collapse>
		</Box>
	);
};

export default CreatePublication;

