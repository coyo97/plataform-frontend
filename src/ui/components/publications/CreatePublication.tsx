// CreatePublication.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePublication: React.FC = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const navigate = useNavigate();

	// Manejar cambio de archivo
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	// Manejar envío del formulario
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('title', title);
		formData.append('content', content);
		if (file) {
			formData.append('file', file); // Adjunta el archivo
		}

		// Convertir las etiquetas a un array y agregarlo al formData
		const tagsArray = tags.split(',').map(tag => tag.trim());
		formData.append('tags', JSON.stringify(tagsArray)); 

		try {
			const token = localStorage.getItem('token');
			// Enviar la publicación al backend
			await axios.post('http://localhost:8000/v1.0/api/publications', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${token}`, // Asegúrate de enviar el token aquí
				},
			});
			alert('Publicación creada con éxito');
			navigate('/publications'); // Redirigir a la página de publicaciones o mostrar un mensaje de éxito
		} catch (error) {
			console.error('Error al crear la publicación:', error);
			// Aquí puedes añadir manejo de errores, mostrar un mensaje, etc.
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
				onChange={handleFileChange} // Agregar manejador de archivos
			/>
			<button type="submit">Crear Publicación</button>
		</form>
	);
};

export default CreatePublication;

