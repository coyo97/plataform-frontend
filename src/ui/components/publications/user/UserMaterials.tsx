import React, { useEffect, useState } from 'react';
import { getPublications, updatePublication, deletePublication } from '../../../../async/services/publicationService';
import getEnvVariables from '../../../../config/configEnvs';
import {
	Container,
	PublicationCard,
	PublicationTitle,
	PublicationContent,
	Tags,
	EditButton,
	DeleteButton,
	EditForm,
	Input,
	TextArea,
	FileInput,
	UpdateButton,
	CancelButton,
} from './userMaterialsStyles';

interface Publication {
	_id: string;
	title: string;
	content: string;
	tags: string[];
	author: {
		username: string;
	};
	filePath?: string;
	fileType?: string;
}

const ViewUserPublications: React.FC = () => {
	const [publications, setPublications] = useState<Publication[]>([]);
	const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState('');
	const [newImage, setNewImage] = useState<File | null>(null);

	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchUserPublications = async () => {
			try {
				const data = await getPublications(`${HOST}${SERVICE}/user-publications`, {});
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

	const handleUpdate = async () => {
		if (!selectedPublication) return;

		const formData = new FormData();
		formData.append('title', title);
		formData.append('content', content);
		formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));

		if (newImage) {
			formData.append('file', newImage);
		}

		try {
			await updatePublication(`${HOST}${SERVICE}/user-publications/${selectedPublication._id}`, formData);
			alert('Publicación actualizada con éxito');

			const data = await getPublications(`${HOST}${SERVICE}/user-publications`, {});
			setPublications(data.publications);
			setSelectedPublication(null);
		} catch (error) {
			console.error('Error updating publication:', error);
			alert('Error al actualizar la publicación');
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deletePublication(`${HOST}${SERVICE}/publications/${id}`);
			alert('Publicación eliminada con éxito');
			setPublications(publications.filter(pub => pub._id !== id));
		} catch (error) {
			console.error('Error deleting publication:', error);
			alert('Error al eliminar la publicación');
		}
	};

	const renderFile = (publication: Publication) => {
		if (!publication.filePath || !publication.fileType) return null;

		const fileUrl = `${HOST}/${publication.filePath}`;

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
		<Container>
			<h1>Mis Publicaciones</h1>
			{publications.map(publication => (
				<PublicationCard key={publication._id}>
					<PublicationTitle>{publication.title}</PublicationTitle>
					<PublicationContent>{publication.content}</PublicationContent>
		  <Tags><strong>Etiquetas:</strong> {publication.tags.join(', ')}</Tags>
					{renderFile(publication)}
					<EditButton onClick={() => handleEdit(publication)}>Editar</EditButton>
					<DeleteButton onClick={() => handleDelete(publication._id)}>Eliminar</DeleteButton>
				</PublicationCard>
			))}

			{selectedPublication && (
				<EditForm>
					<h2>Editar Publicación</h2>
					<Input
						type="text"
						placeholder="Título"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TextArea
						placeholder="Contenido"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<Input
						type="text"
						placeholder="Etiquetas (separadas por comas)"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
					<FileInput
						type="file"
						onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
					/>
					<UpdateButton onClick={handleUpdate}>Actualizar</UpdateButton>
					<CancelButton onClick={() => setSelectedPublication(null)}>Cancelar</CancelButton>
				</EditForm>
			)}
		</Container>
	);
};

export default ViewUserPublications;

