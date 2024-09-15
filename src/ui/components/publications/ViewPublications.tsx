import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Asegúrate de tener axios importado para hacer solicitudes HTTP
import { getPublications } from '../../../async/services/publicationService';
import { useNavigate } from 'react-router-dom';

import CommentSection from '../comments/CommentSection';

interface Publication {
	_id: string;
	title: string;
	content: string;
	tags: string[];
	author: {
		_id: string;
		username: string;
	};
	filePath?: string;
	fileType?: string;
}

interface Career {
	_id: string;
	name: string;
}

const ViewPublications: React.FC = () => {
	const [publications, setPublications] = useState<Publication[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [selectedCareer, setSelectedCareer] = useState<string>('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCareers = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:8000/v1.0/api/careers', {
					headers: { 'Authorization': `Bearer ${token}` },
				});
				setCareers(response.data.careers);
			} catch (error) {
				console.error('Error fetching careers:', error);
			}
		};

		fetchCareers();
	}, []);

	useEffect(() => {
		const fetchPublications = async () => {
			try {
				const endpoint = selectedCareer
					? `http://localhost:8000/v1.0/api/publications/career/${selectedCareer}`
					: 'http://localhost:8000/v1.0/api/publications';

				const data = await getPublications(endpoint, {});
				setPublications(data.publications);
			} catch (error) {
				console.error('Error fetching publications:', error);
			}
		};

		fetchPublications();
	}, [selectedCareer]); // Dependencia de selectedCareer para actualizar cuando cambia

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

	const handleAuthorClick = (authorId: string, authorUsername: string) => {
		const userProfileId = authorId;
		navigate(`/profile/${authorUsername}`, { state: { userProfileId } });
	};

	return (
		<div>
			<h1>Publicaciones</h1>
			{careers.length > 0 && (
				<select
					value={selectedCareer}
					onChange={(e) => setSelectedCareer(e.target.value)}
				>
					<option value="">Filtrar por carrera (opcional)</option>
					{careers.map(career => (
						<option key={career._id} value={career._id}>
							{career.name}
						</option>
					))}
				</select>
			)}
			{publications.map((publication) => (
				<div key={publication._id} style={{ marginBottom: '20px' }}>
					<h2>{publication.title}</h2>
					<p>{publication.content}</p>
					<p>
						<strong>Autor:</strong>{' '}
						<button
							onClick={() => handleAuthorClick(publication.author._id, publication.author.username)}
							style={{
								color: 'blue',
								textDecoration: 'underline',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
							}}
						>
							{publication.author.username}
						</button>
					</p>
					<p><strong>Etiquetas:</strong> {publication.tags.join(', ')}</p>
					{renderFile(publication)}

					<CommentSection publicationId={publication._id} />
				</div>
			))}
		</div>
	);
};

export default ViewPublications;

