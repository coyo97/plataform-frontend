// src/ui/shared/organisms/SearchOverlay/SearchOverlay.tsx
import React, { useState } from 'react';
import { Modal, Typography } from '@mui/material';
import SearchInput from '../../molecules/searchInput';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
	SearchOverlayProps, 
	SearchCategory, 
	SearchResult 
} from './searchOverlay.types';
import { OverlayContainer, ResultsSection, TabsContainer, TabItem } from './searchOverlay.styles';

import { searchUsers } from '../../../../async/services/friendService';
import { searchPublications } from '../../../../async/services/publicationService';
import { Publication } from '../../../../types/publication';

import PersonResultCard from './results/PersonResultCard';
import PostResultCard from './results/PostResultCard';
import VideoResultCard from './results/VideoResultCard';
import MaterialResultCard from './results/MaterialResultCard';
import getEnvVariables from '../../../../config/configEnvs';

const SearchOverlay: React.FC<SearchOverlayProps> = ({
	onSearch,
	placeholder = 'Buscar...',
	initialResults = [],
	categories = ['all', 'people', 'posts', 'videos', 'materials'],
}) => {
	const [results, setResults] = useState<SearchResult[]>(initialResults);
	const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');

	const { HOST } = getEnvVariables();

	const navigate = useNavigate();
	const location = useLocation();
	const open = location.pathname === "/plataform/search";

	const handleSearch = async (q: string) => {
  onSearch(q, activeCategory);

  // No buscar si la query es demasiado corta
  if (!q || q.trim().length < 2) {
    setResults(initialResults);
    return;
  }

  let newResults: SearchResult[] = [];

  try {
    if (activeCategory === 'people' || activeCategory === 'all') {
      const users = await searchUsers(q);

      //  Filtrar en frontend (por si el backend devuelve demasiado ruido)
      const filteredUsers = users.filter((u) =>
        u.username?.toLowerCase().includes(q.toLowerCase()) ||
        u.email?.toLowerCase().includes(q.toLowerCase())
      );

      newResults.push(
        ...filteredUsers.map((u) => ({
          id: u._id,
          type: 'people' as const,
          title: `${u.username}`,
          description: u.career ?? '',
          thumbnail: u.avatarUrl,
          author: u,
        }))
      );
    }


			if (activeCategory === 'posts' || activeCategory === 'all') {
				const pubs = await searchPublications(q);
				newResults.push(
					...pubs.map((p:Publication) => ({
						id: p._id,
						type: 'posts' as const,
						title: p.title ?? 'Publicación',
						description: p.content.slice(0, 100),
					}))
				);
			}

			if (activeCategory === 'videos') {
				newResults.push({
					id: 'demo-video',
					type: 'videos',
					title: `Video relacionado con "${q}"`,
					description: 'Demo temporal',
					thumbnail: 'https://via.placeholder.com/120',
				});
			}

			if (activeCategory === 'materials') {
				newResults.push({
					id: 'demo-material',
					type: 'materials',
					title: `Material de estudio: ${q}`,
					description: 'Ejemplo de material académico',
				});
			}
		} catch (err) {
			console.error('Error en búsqueda:', err);
		}

		setResults(newResults);
	};

	const filteredResults =
		activeCategory === 'all'
			? results
			: results.filter((r) => r.type === activeCategory);

			return (
				<>
					<SearchInput
						onSearch={handleSearch}
						liveSearch
						debounceMs={300}
						fireOnBlur={false}
						placeholder={placeholder}
						// @ts-ignore
						onFocus={() => navigate('/plataform/search')} // 🔹 Solo navega
						sx={{ maxWidth: 200 }}
					/>

					<Modal open={open} onClose={() => navigate('/plataform')}>
						<OverlayContainer>
							{/* Input dentro del overlay */}
							<SearchInput
								onSearch={handleSearch}
								liveSearch
								debounceMs={300}
								fireOnBlur={false}
								placeholder={placeholder}
							/>

							<TabsContainer>
								{categories.map((cat) => (
									<TabItem
										key={cat}
										active={activeCategory === cat}
										onClick={() => setActiveCategory(cat)}
									>
										{cat === 'all' && 'Todo'}
										{cat === 'people' && 'Personas'}
										{cat === 'posts' && 'Publicaciones'}
										{cat === 'videos' && 'Videos'}
										{cat === 'materials' && 'Materiales'}
									</TabItem>
								))}
							</TabsContainer>

							<ResultsSection>
								{filteredResults.length === 0 ? (
									<Typography variant="body2" color="text.secondary">
										No se encontraron resultados en {activeCategory}.
									</Typography>
								) : (
								filteredResults.map((r) => {
									switch (r.type) {
										case 'people':
											return (
												<PersonResultCard
													key={r.id}
													result={r}
													author={r.author} 
													HOST={HOST}      
													onAuthor={(id, username) =>
														navigate(`/profile/${username}`, { state: { userProfileId: id } })
													}
												/>
										);
										case 'posts':
											return <PostResultCard key={r.id} result={r} />;
										case 'videos':
											return <VideoResultCard key={r.id} result={r} />;
										case 'materials':
											return <MaterialResultCard key={r.id} result={r} />;
										default:
											return (
												<Typography key={r.id} variant="body1" sx={{ mb: 1 }}>
													{r.title}
												</Typography>
										);
									}
								})
								)}
							</ResultsSection>

						</OverlayContainer>
					</Modal>
				</>
			);
};

export default SearchOverlay;

