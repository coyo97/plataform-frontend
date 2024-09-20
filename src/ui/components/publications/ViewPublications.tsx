import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios'; // Asegúrate de tener axios importado para hacer solicitudes HTTP
import { getPublications } from '../../../async/services/publicationService';
import { useNavigate } from 'react-router-dom';

import CommentSection from '../comments/CommentSection';
import getEnvVariables from '../../../config/configEnvs';

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
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const observer = useRef<IntersectionObserver | null>(null);
	const navigate = useNavigate();

	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchCareers = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`${HOST}${SERVICE}/careers`, {
					headers: { 'Authorization': `Bearer ${token}` },
				});
				setCareers(response.data.careers);
			} catch (error) {
				console.error('Error fetching careers:', error);
			}
		};

		fetchCareers();
	}, [HOST, SERVICE]);

	const fetchPublications = useCallback(async () => {
		try {
			const endpoint = selectedCareer
				? `${HOST}${SERVICE}/publications/career/${selectedCareer}?page=${page}`
				: `${HOST}${SERVICE}/publications?page=${page}`;

			console.log(`Fetching from: ${endpoint}`); // Log para ver qué URL se está llamando
			const data = await getPublications(endpoint, {});
			console.log('Fetched publications:', data.publications); // Log para ver las publicaciones obtenidas
			setPublications((prevPublications) => [...prevPublications, ...data.publications]);
			setHasMore(data.publications.length > 0); // Si no hay más publicaciones, detén la carga
		} catch (error) {
			console.error('Error fetching publications:', error);
		}
	}, [HOST, SERVICE, selectedCareer, page]);

	useEffect(() => {
		fetchPublications();
	}, [fetchPublications]);

	const lastPublicationRef = useRef<HTMLDivElement | null>(null);

	const lastPublicationElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					console.log('IntersectionObserver triggered - loading more...'); // Log para ver si se activa el observer
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[hasMore]
	);

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
					onChange={(e) => {
						setSelectedCareer(e.target.value);
						setPublications([]);
						setPage(1);
					}}
				>
					<option value="">Filtrar por carrera (opcional)</option>
					{careers.map(career => (
						<option key={career._id} value={career._id}>
							{career.name}
						</option>
					))}
				</select>
			)}
			{publications.map((publication, index) => {
				const key = `${publication._id}-${index}`; // Agrega el índice al key para asegurarse de que sea único.
				if (publications.length === index + 1) {
					return (
						<div
							key={key}
							ref={lastPublicationElementRef}
							style={{ marginBottom: '20px' }}
						>
							<h2>{publication.title}</h2>
							<p>{publication.content}</p>
							<p>
								<strong>Autor:</strong>{' '}
								<button
									onClick={() =>
										handleAuthorClick(publication.author._id, publication.author.username)
									}
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
							<p>
								<strong>Etiquetas:</strong> {publication.tags.join(', ')}
							</p>
							{renderFile(publication)}

							<CommentSection publicationId={publication._id} />
						</div>
					);
				} else {
					return (
						<div key={key} style={{ marginBottom: '20px' }}>
							<h2>{publication.title}</h2>
							<p>{publication.content}</p>
							<p>
								<strong>Autor:</strong>{' '}
								<button
									onClick={() =>
										handleAuthorClick(publication.author._id, publication.author.username)
									}
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
							<p>
								<strong>Etiquetas:</strong> {publication.tags.join(', ')}
							</p>
							{renderFile(publication)}

							<CommentSection publicationId={publication._id} />
						</div>
					);
				}
			})}
		</div>
	);
};

export default ViewPublications;

