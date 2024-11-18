import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CommentSection from '../comments/CommentSection';
import getEnvVariables from '../../../config/configEnvs';

import {
	SidebarContainer,
	FilterTitle,
	FilterButton,
} from './viewPublicationsStyles.styles';

import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Avatar,
	IconButton,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';

import ReportDialog from './ReportDialog'; // Nuevo componente
import SearchBar from './SearchBar'; // Nuevo componente
import CreatePublication from './CreatePublication';

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
	likes: string[];
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedFilter, setSelectedFilter] = useState<string>('mostRecent');

	const [openReportDialog, setOpenReportDialog] = useState<boolean>(false);
	const [publicationToReport, setPublicationToReport] = useState<string>('');

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
  const handleNewPublication = (newPublication: Publication) => {
    // Añadir la nueva publicación al inicio de la lista
    setPublications((prevPublications) => [newPublication, ...prevPublications]);
  };
	const fetchPublications = useCallback(
		async (pageToFetch: number, filterType?: string, searchQuery = '') => {
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

				setPublications((prevPublications) => {
					const publicationsMap = new Map();
					[...prevPublications, ...data.publications].forEach((pub) => {
						publicationsMap.set(pub._id, pub);
					});
					return Array.from(publicationsMap.values());
				});

				setHasMore(data.publications.length > 0);
			} catch (error) {
				console.error('Error fetching publications:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[HOST, SERVICE, selectedCareer, selectedFilter] // Eliminamos isLoading de las dependencias
	);
	useEffect(() => {
		setPublications([]);
		setPage(1);
		fetchPublications(1, selectedFilter === 'career' ? 'career' : selectedFilter);
	}, [selectedFilter, selectedCareer]); // Eliminamos fetchPublications de las dependencias

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
		[hasMore, isLoading, page, fetchPublications, selectedFilter]
	);

	const renderFile = useCallback(
		(publication: Publication) => {
			if (!publication.filePath || !publication.fileType) return null;

			const fileUrl = `${HOST}/${publication.filePath}`;

			if (publication.fileType.startsWith('image/')) {
				return <img src={fileUrl} alt={publication.title} style={{ width: '100%', maxWidth: '500px', height: 'auto' }} />;
			} else if (publication.fileType.startsWith('video/')) {
				return (
					<video controls style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
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
		},
		[HOST]
	);

	const handleAuthorClick = useCallback(
		(authorId: string, authorUsername: string) => {
			const userProfileId = authorId;
			navigate(`/profile/${authorUsername}`, { state: { userProfileId } });
		},
		[navigate]
	);

	// Funciones para manejar el diálogo de reporte
	const handleOpenReportDialog = useCallback((publicationId: string) => {
		setPublicationToReport(publicationId);
		setOpenReportDialog(true);
	}, []);

	const handleCloseReportDialog = useCallback(() => {
		setOpenReportDialog(false);
		setPublicationToReport('');
	}, []);

	// Funciones para manejar likes
	const handleLike = useCallback(async (publicationId: string) => {
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
	}, [HOST, SERVICE]);

	const handleUnlike = useCallback(async (publicationId: string) => {
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
	}, [HOST, SERVICE]);

	// Manejo de la búsqueda
	const handleSearch = useCallback(
		(searchQuery: string) => {
			setPublications([]);
			setPage(1);
			fetchPublications(1, selectedFilter === 'career' ? 'career' : selectedFilter, searchQuery);
		},
		[fetchPublications, selectedFilter]
	);

	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', padding: '20px' }}>
			<SidebarContainer>
				<CreatePublication onPublicationCreated={handleNewPublication}/>
				<FilterTitle>Filtrar Publicaciones</FilterTitle>

				{/* Sección de Filtrado por Carrera */}
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>Filtrar por Carrera</Typography>
					</AccordionSummary>
					<AccordionDetails>
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
					</AccordionDetails>
				</Accordion>

				{/* Sección de Ordenamiento */}
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>Ordenar Publicaciones</Typography>
					</AccordionSummary>
					<AccordionDetails>
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
					</AccordionDetails>
				</Accordion>

				{/* Botón para Limpiar Filtros */}
				<FilterButton
					active={selectedFilter === '' && selectedCareer === ''}
					onClick={() => {
						setSelectedFilter('');
						setSelectedCareer('');
						setPublications([]);
						setPage(1);
						fetchPublications(1, 'mostRecent');
					}}
				>
					Ver todas las publicaciones
				</FilterButton>
			</SidebarContainer>
			<div style={{ flex: 1, marginLeft: '20px' }}>
				{/* Formulario de búsqueda */}
				<SearchBar onSearch={handleSearch} />

				{publications.map((publication, index) => {
					const currentUserId = localStorage.getItem('userId') || '';
					const hasLiked = publication.likes.includes(currentUserId);

					// Verifica si el autor existe
					const isAuthorPresent = publication.author && publication.author.username;

					return (
						<div
							key={publication._id}
							ref={index === publications.length - 1 ? lastPublicationElementRef : null}
						>
							<Card style={{ marginBottom: '20px', width: '100%' }}>
								<CardHeader
									avatar={
										isAuthorPresent ? (
											<Avatar
												src={
													publication.author.profile?.profilePicture
														? `${HOST}/${publication.author.profile.profilePicture}`
														: 'https://ptetutorials.com/images/user-profile.png'
												}
												alt={publication.author.username}
												style={{ cursor: 'pointer' }}
												onClick={() => handleAuthorClick(publication.author._id, publication.author.username)}
											/>
									) : (
										<Avatar alt="Usuario Eliminado">?</Avatar>
									)
									}
									title={publication.title}
									subheader={
										isAuthorPresent
											? `Publicado por ${publication.author.username}`
											: 'Publicado por un usuario eliminado'
									}
									action={
										<IconButton
											onClick={() => handleOpenReportDialog(publication._id)}
											aria-label="Reportar"
										>
											<ReportOutlinedIcon color="error" />
										</IconButton>
									}
								/>
								<CardContent>
									<Typography variant="body2" color="textSecondary" component="p">
										{publication.content}
									</Typography>
									{/* Mostrar archivo si existe */}
									{renderFile(publication)}
								</CardContent>
								<CardActions disableSpacing>
									<IconButton
										onClick={() => (hasLiked ? handleUnlike(publication._id) : handleLike(publication._id))}
										aria-label={hasLiked ? 'Quitar Me Gusta' : 'Me Gusta'}
									>
										{hasLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
									</IconButton>
									<Typography variant="body2">{publication.likes.length}</Typography>
									<IconButton aria-label="Comentarios">
										<CommentIcon />
									</IconButton>
								</CardActions>
								{/* Sección de Comentarios */}
								<CommentSection publicationId={publication._id} />
							</Card>
						</div>
					);
				})}
				{/* Diálogo de Reporte */}
				{openReportDialog && (
					<ReportDialog
						open={openReportDialog}
						onClose={handleCloseReportDialog}
						publicationId={publicationToReport}
					/>
				)}
			</div>
		</div>
	);
};

export default ViewPublications;

