import React, { useEffect, useState } from 'react';
import { getPublications, updatePublication, deletePublication } from '../../../../async/services/publicationService';

interface Publication {
	_id: string;
	title: string;
	content: string;
	tags: string[];
	author: {
		username: string;
	};
	filePath?: string; // Ruta al archivo
	fileType?: string; // Tipo de archivo (opcional)
}

const ViewUserPublications: React.FC = () => {
	const [publications, setPublications] = useState<Publication[]>([]);
	const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState('');
	const [newImage, setNewImage] = useState<File | null>(null);

	useEffect(() => {
		const fetchUserPublications = async () => {
			try {
				const data = await getPublications('http://localhost:8000/v1.0/api/user-publications', {});
				setPublications(data.publications);
			} catch (error) {
				console.error('Error fetching user publications:', error);
			}
		};

		fetchUserPublications();
	}, []);

	const handleEdit = (publication: Publication) => {
		setSelectedPublication(publication);
		setTitle(publication.title);
		setContent(publication.content);
		setTags(publication.tags.join(', '));
	};

	useEffect(() => {
		console.log('Estado de publicaciones:', publications);
	}, [publications]); // Esto debe ejecutarse cada vez que las publicaciones cambien


	// Manejador para la actualización de la publicación
	const handleUpdate = async () => {
		if (!selectedPublication) return;

		const formData = new FormData();
		formData.append('title', title);
		formData.append('content', content);
		formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim()))); // Asegúrate de enviar las tags como string en JSON
		if (newImage) {
			formData.append('file', newImage);
			console.log('Imagen seleccionada:', newImage);
		}

		try {
			console.log('FormData para actualizar:', formData);

			// Actualiza la publicación
			await updatePublication(`http://localhost:8000/v1.0/api/user-publications/${selectedPublication._id}`, formData);
				alert('Publicación actualizada con éxito');

			// Refrescar las publicaciones para ver los cambios
			const data = await getPublications('http://localhost:8000/v1.0/api/user-publications', {});
			console.log('Publicaciones después de actualizar:', data.publications);
			setPublications(data.publications);

			setSelectedPublication(null); // Limpia la publicación seleccionada después de actualizar
		} catch (error) {
			console.error('Error updating publication:', error);
			alert('Error al actualizar la publicación');
		}
	};


	const handleDelete = async (id: string) => {
		try {
			await deletePublication(`http://localhost:8000/v1.0/api/publications/${id}`);
				alert('Publicación eliminada con éxito');
			setPublications(publications.filter(pub => pub._id !== id));
		} catch (error) {
			console.error('Error deleting publication:', error);
			alert('Error al eliminar la publicación');
		}
	};

	const renderFile = (publication: Publication) => {
		if (!publication.filePath || !publication.fileType) return null;

		const fileUrl = `http://localhost:8000/${publication.filePath}`;

			if (publication.fileType.startsWith('image/')) {
			return <img src={fileUrl} alt={publication.title} style={{ width: '300px', height: 'auto' }} />;
		} else if (publication.fileType.startsWith('video/')) {
			return (
				<video controls style={{ width: '300px', height: 'auto' }}>
					<source src={fileUrl} type={publication.fileType} />
					Tu navegador no soporta la reproducción de video.
				</video>
			);
		} else if (publication.fileType === 'application/pdf') {
			return (
				<a href={fileUrl} target="_blank" rel="noopener noreferrer">
					Ver PDF
				</a>
			);
		} else {
			return (
				<a href={fileUrl} download>
					Descargar archivo
				</a>
			);
		}
	};

	return (
		<div>
			<h1>Mis Publicaciones</h1>
			{publications.map((publication) => (
				<div key={publication._id} style={{ marginBottom: '20px' }}>
					<h2>{publication.title}</h2>
					<p>{publication.content}</p>
					<p><strong>Etiquetas:</strong> {publication.tags.join(', ')}</p>
					{renderFile(publication)}
					<button onClick={() => handleEdit(publication)}>Editar</button>
					<button onClick={() => handleDelete(publication._id)}>Eliminar</button>
				</div>
			))}

			{selectedPublication && (
				<div style={{ marginTop: '20px' }}>
					<h2>Editar Publicación</h2>
					<input 
						type="text" 
						placeholder="Título" 
						value={title} 
						onChange={(e) => setTitle(e.target.value)} 
					/>
					<textarea 
						placeholder="Contenido" 
						value={content} 
						onChange={(e) => setContent(e.target.value)} 
					/>
					<input 
						type="text" 
						placeholder="Etiquetas (separadas por comas)" 
						value={tags} 
						onChange={(e) => setTags(e.target.value)} 
					/>
					<input 
						type="file" 
						onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)} 
					/>
					<button onClick={handleUpdate}>Actualizar</button>
					<button onClick={() => setSelectedPublication(null)}>Cancelar</button>
				</div>
			)}
		</div>
	);
};

export default ViewUserPublications;

