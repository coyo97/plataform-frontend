import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios'; // Asegúrate de tener axios importado para hacer solicitudes HTTP
import { getPublications } from '../../../async/services/publicationService';
import { useNavigate } from 'react-router-dom';

import CommentSection from '../comments/CommentSection';
import getEnvVariables from '../../../config/configEnvs';

import {
    PublicationContainer,
    PublicationContent,
    FilePreview,
    UserProfileImage,
    CommentButton,
    SidebarContainer,
    FilterTitle,
    FilterButton
} from './viewPublicationsStyles.styles'; // Importa los estilos

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
		<div style={{ display: 'flex' }}>
			<SidebarContainer>
				<FilterTitle>Filtrar publicación</FilterTitle>
				{careers.map((career) => (
					<FilterButton
						key={career._id}
						active={selectedCareer === career._id}
						onClick={() => {
							setSelectedCareer(career._id);
							setPublications([]);
							setPage(1);
						}}
					>
						{career.name}
					</FilterButton>
				))}
			</SidebarContainer>
			<div>
				{publications.map((publication, index) => (
					<PublicationContainer key={`${publication._id}-${index}`} ref={lastPublicationElementRef}>
						<UserProfileImage src="/path-to-profile-image.jpg" alt="User" /> {/* Ajusta la imagen */}
						<PublicationContent>
							<h2>{publication.title}</h2>
							<p>{publication.content}</p>
							<p>
								<strong>Autor:</strong>{' '}
								<button onClick={() => handleAuthorClick(publication.author._id, publication.author.username)}>
									{publication.author.username}
								</button>
							</p>
							{renderFile(publication)}
							<CommentSection publicationId={publication._id} />
						</PublicationContent>
					</PublicationContainer>
				))}
			</div>
		</div>
	);
	

};


export default ViewPublications;

