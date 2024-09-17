// CreatePublication.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

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
	const navigate = useNavigate();

	const {HOST, SERVICE} = getEnvVariables();

	useEffect(() => {
		// Fetch careers associated with the user
		const fetchCareers = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`${HOST}${SERVICE}/careers`, {
					headers: { 'Authorization': `Bearer ${token}` },
				});
				setCareers(response.data.careers);
				if (response.data.careers.length === 1) {
					setSelectedCareer(response.data.careers[0]._id); // Auto-select if only one career
				}
			} catch (error) {
				console.error('Error fetching careers:', error);
			}
		};

		fetchCareers();
	}, []);

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
			formData.append('careerId', selectedCareer); // Add career ID if selected
		}

		try {
			const token = localStorage.getItem('token');
			await axios.post(`${HOST}${SERVICE}/publications`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${token}`,
				},
			});
			alert('Publicación creada con éxito');
			navigate('/publications');
		} catch (error) {
			console.error('Error al crear la publicación:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Título"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
			/>
			<textarea
				placeholder="Contenido"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				required
			></textarea>
			<input
				type="text"
				placeholder="Etiquetas (separadas por comas)"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
			/>
			<input
				type="file"
				onChange={handleFileChange}
			/>
			{careers.length > 0 && (
				<select
					value={selectedCareer}
					onChange={(e) => setSelectedCareer(e.target.value)}
				>
					<option value="">Selecciona una carrera (opcional)</option>
					{careers.map(career => (
						<option key={career._id} value={career._id}>
							{career.name}
						</option>
					))}
				</select>
			)}
			<button type="submit">Crear Publicación</button>
		</form>
	);
};

export default CreatePublication;

