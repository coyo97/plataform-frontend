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
	FilterButton,
} from './viewPublicationsStyles.styles'; // Importa los estilos

interface Publication {
	_id: string;
	title: string;
	content: string;
	tags: string[];
	author: {
		_id: string;
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};
	filePath?: string;
	fileType?: string;
	likes: string[]; // Añadido: Array de IDs de usuarios que han dado like
}

interface Career {
	_id: string;
	name: string;
}

const ViewPublications: React.FC = () => {
	const [publications, setPublications] = useState<Publication[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [selectedCareer, setSelectedCareer] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>(''); // Añadido: Estado para la búsqueda
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedFilter, setSelectedFilter] = useState<string>('mostRecent');

	const observer = useRef<IntersectionObserver | null>(null);
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
			} catch (error) {
				console.error('Error fetching careers:', error);
			}
		};

		fetchCareers();
	}, [HOST, SERVICE]);

	const fetchPublications = async (pageToFetch: number, filterType?: string) => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			let endpoint = '';
			const token = localStorage.getItem('token');

			if (searchQuery.trim() !== '') {
				endpoint = `${HOST}${SERVICE}/publications/search?query=${encodeURIComponent(
					searchQuery
				)}&page=${pageToFetch}`;
			} else if (filterType === 'mostLiked') {
				endpoint = `${HOST}${SERVICE}/publications/most-liked?page=${pageToFetch}`;
			} else if (filterType === 'mostCommented') {
				endpoint = `${HOST}${SERVICE}/publications/most-commented?page=${pageToFetch}`;
			} else if (filterType === 'career' && selectedCareer) {
				endpoint = `${HOST}${SERVICE}/publications/career/${selectedCareer}?page=${pageToFetch}`;
			} else {
				endpoint = `${HOST}${SERVICE}/publications?page=${pageToFetch}`;
			}

			console.log(`Fetching from: ${endpoint}`);
			const response = await axios.get(endpoint, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = response.data;
			setPublications((prevPublications) => [...prevPublications, ...data.publications]);
			setHasMore(data.publications.length > 0);
		} catch (error) {
			console.error('Error fetching publications:', error);
		} finally {
			setIsLoading(false);
		}
	};


	useEffect(() => {
		setPublications([]);
		setPage(1);
		fetchPublications(1, selectedFilter === 'career' ? 'career' : selectedFilter);
	}, [selectedFilter, selectedCareer]);

	const lastPublicationRef = useRef<HTMLDivElement | null>(null);

	const lastPublicationElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					console.log('IntersectionObserver triggered - loading more...');
					const nextPage = page + 1;
					fetchPublications(nextPage, selectedFilter === 'career' ? 'career' : selectedFilter);
					setPage(nextPage);
				}
			});
			if (node) observer.current.observe(node);
		},
		[hasMore, isLoading, page, selectedFilter]
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

	const reportPublication = async (publicationId: string) => {
		const reason = prompt('Por favor, ingresa la razón del reporte:');
		if (!reason) return;

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/publications/${publicationId}/report`,
				{ reason },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Reporte enviado correctamente');
		} catch (error) {
			console.error('Error al reportar la publicación:', error);
			alert('Error al reportar la publicación');
		}
	};

	// Funciones para manejar likes
	const handleLike = async (publicationId: string) => {
		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/publications/${publicationId}/like`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// Actualizar el estado de las publicaciones
			setPublications((prevPublications) =>
							prevPublications.map((pub) => {
				if (pub._id === publicationId) {
					return {
						...pub,
						likes: [...pub.likes, localStorage.getItem('userId') || ''],
					};
				}
				return pub;
			})
						   );
		} catch (error) {
			console.error('Error al dar like:', error);
		}
	};

	const handleUnlike = async (publicationId: string) => {
		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/publications/${publicationId}/unlike`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// Actualizar el estado de las publicaciones
			setPublications((prevPublications) =>
							prevPublications.map((pub) => {
				if (pub._id === publicationId) {
					return {
						...pub,
						likes: pub.likes.filter((userId) => userId !== localStorage.getItem('userId')),
					};
				}
				return pub;
			})
						   );
		} catch (error) {
			console.error('Error al quitar like:', error);
		}
	};

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPublications([]);
		setPage(1);
		fetchPublications(1);
	};


	return (
		<div style={{ display: 'flex' }}>
			<SidebarContainer>
				<FilterTitle>Filtrar publicación</FilterTitle>
				<FilterButton
					active={selectedFilter === 'mostRecent'}
					onClick={() => {
						setSelectedFilter('mostRecent');
						setSelectedCareer('');
						setPublications([]);
						setPage(1);
						fetchPublications(1, 'mostRecent');
					}}
				>
					Más recientes
				</FilterButton>
				<FilterButton
					active={selectedFilter === 'mostLiked'}
					onClick={() => {
						setSelectedFilter('mostLiked');
						setSelectedCareer('');
						setPublications([]);
						setPage(1);
						fetchPublications(1, 'mostLiked');
					}}
				>
					Más gustadas
				</FilterButton>
				<FilterButton
					active={selectedFilter === 'mostCommented'}
					onClick={() => {
						setSelectedFilter('mostCommented');
						setSelectedCareer('');
						setPublications([]);
						setPage(1);
						fetchPublications(1, 'mostCommented');
					}}
				>
					Más comentadas
				</FilterButton>
				{/* Opciones de carrera */}
				{careers.map((career) => (
					<FilterButton
						key={career._id}
						active={selectedCareer === career._id}
						onClick={() => {
							setSelectedCareer(career._id);
							setSelectedFilter('');
							setPublications([]);
							setPage(1);
							fetchPublications(1, 'career');
						}}
					>
						{career.name}
					</FilterButton>
				))}
			</SidebarContainer>
			<div style={{ flex: 1 }}>
				{/* Añadido: Formulario de búsqueda */}
				<form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
					<input
						type="text"
						placeholder="Buscar publicaciones..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
						}}

						style={{ width: '300px', padding: '8px' }}
					/>
					<button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>
						Buscar
					</button>
				</form>
				{publications.map((publication, index) => {
					// Determinar si el usuario actual ha dado like
					const currentUserId = localStorage.getItem('userId') || '';
					const hasLiked = publication.likes.includes(currentUserId);

					return (
						<PublicationContainer
							key={`${publication._id}-${index}`}
							ref={index === publications.length - 1 ? lastPublicationElementRef : null}
						>
							<UserProfileImage
								src={
									publication.author.profile?.profilePicture
										? `${HOST}/${publication.author.profile.profilePicture}`
										: 'https://ptetutorials.com/images/user-profile.png'
								}
								alt={publication.author.username}
							/>
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
								{/* Botón de Like/Unlike y contador de likes */}
								<div>
									{hasLiked ? (
										<button onClick={() => handleUnlike(publication._id)}>Quitar Me Gusta</button>
									) : (
										<button onClick={() => handleLike(publication._id)}>Me Gusta</button>
									)}
									<span>{publication.likes.length} Me Gusta</span>
								</div>
								<CommentSection publicationId={publication._id} />
							</PublicationContent>
							<button onClick={() => reportPublication(publication._id)}>Reportar</button>
						</PublicationContainer>
					);
				})}
			</div>
		</div>
	);
};

export default ViewPublications;

