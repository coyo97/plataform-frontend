// src/components/publications/PublicationDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import CommentSection from '../comments/CommentSection';

interface Publication {
	_id: string;
	title: string;
	content: string;
	author: {
		_id: string;
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};
	filePath?: string;
	fileType?: string;
	likes: string[];
}

const PublicationDetail: React.FC = () => {
	const { publicationId } = useParams<{ publicationId: string }>();
	const [publication, setPublication] = useState<Publication | null>(null);
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchPublication = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/publications/${publicationId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPublication(response.data.publication);
			} catch (error) {
				console.error('Error fetching publication:', error);
			}
		};

		fetchPublication();
	}, [HOST, SERVICE, publicationId, token]);

	if (!publication) {
		return <div>Cargando publicación...</div>;
	}

	// Función para renderizar el archivo adjunto
	const renderFile = () => {
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
		<div>
			<h2>{publication.title}</h2>
			<p>{publication.content}</p>
			<p>
				<strong>Autor:</strong> {publication.author.username}
			</p>
			{renderFile()}
			{/* Aquí puedes agregar más detalles y funcionalidades, como comentarios */}
			{/* Si deseas reutilizar el componente de comentarios */}
			<CommentSection publicationId={publication._id} />
		</div>
	);
};

export default PublicationDetail;

