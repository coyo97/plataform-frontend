// src/ui/features/dashboard/organisms/TopPostsPanel.tsx
import React, { useEffect, useMemo } from 'react';
import { Box, Button, Paper, Skeleton } from '@mui/material';
import { Favorite, ChatBubble } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';

import AvatarX      from '../../../shared/atoms/avatar/AvatarX';
import Text         from '../../../shared/atoms/typography/Text';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';

import { usePublicationsFeed } from '../../../features/publications/hooks/usePublicationsFeed';
import { Publication } from '../../../../types/publication';
import getEnvVariables from '../../../../config/configEnvs';
const { HOST } = getEnvVariables();

const sortByPopularity = (a: Publication, b: Publication) => {
	const diffLikes = (b.likes?.length ?? 0) - (a.likes?.length ?? 0);
	return diffLikes !== 0 ? diffLikes : (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
};

const TopPostsPanel: React.FC = () => {
	const navigate = useNavigate();

	const { pubs = [], busy, load } = usePublicationsFeed({
		filter: 'mostLiked',
		careerId: '',
		query: '',
	});

	useEffect(() => {
		if (!pubs.length) load(1);
	}, [pubs.length, load]);

	const top = useMemo(() => [...pubs].sort(sortByPopularity).slice(0, 3), [pubs]);

	return (
		<DashboardCard>
			<Box>
				{/* encabezado */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Text as="h3" headingLevel="h3" system="sans" colorKey="text.primary">
						Publicaciones destacadas
					</Text>
					<Button variant="text" size="small" onClick={() => navigate('/publications')}>
						Ver todas
					</Button>
				</Box>

				{/* contenido */}
				{busy && !pubs.length ? (
					// estado de carga (skeletons)
					<>
						{[0,1,2].map(i => (
							<Paper key={i} sx={{ p: 2, mb: 2, borderRadius: 2 }} elevation={1}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
									<Skeleton variant="circular" width={28} height={28} />
									<Skeleton variant="text" width={140} height={20} />
								</Box>
								<Skeleton variant="text" width="80%" height={22} />
								<Skeleton variant="text" width="60%" height={18} />
							</Paper>
						))}
					</>
				) : !top.length ? (
					<Text size="sm" colorKey="neutral.graySoft.600">
						No hay publicaciones populares.
					</Text>
				) : (
				top.map((p) => {
					const avatar = p.author?.profile?.profilePicture
						? `${HOST}/${p.author.profile.profilePicture}`
						: undefined;

						const titleOrSnippet =
							p.title?.trim() ||
							(p.content ? p.content.trim().slice(0, 80) : '') ||
							'(Sin contenido)';

						return (
							<Paper
								key={p._id}
								sx={{
									p: 2,
									mb: 2,
									cursor: 'pointer',
									borderRadius: 2,
									border: '1px solid',
									borderColor: 'divider',
									transition: 'box-shadow .2s ease, transform .1s ease',
									'&:hover': { boxShadow: 3, transform: 'translateY(-1px)' },
								}}
								elevation={0}
								onClick={() => navigate(`/publications/${p._id}`)}
								role="button"
							>
								{/* autor + fecha */}
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<AvatarX src={avatar} size="sm" />
									<Text as="span" size="sm" weight="bold" colorKey="text.primary">
										{p.author?.username ?? 'Usuario'}
									</Text>
									<DateTimeInfo timestamp={p.created_at} size="small" />
								</Box>

								{/* título o fragmento */}
								<Text
									as="h4"
									size="md"
									weight="bold"
									colorKey="text.primary"
									sx={{
										mt: 0.5,
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
									}}
								>
									{titleOrSnippet}
								</Text>

								{/* stats */}
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
									<Favorite fontSize="small" sx={{ color: 'warning.main' }} />
									<Text as="span" size="sm" colorKey="text.secondary">
										{p.likes?.length ?? 0}
									</Text>

									<ChatBubble fontSize="small" sx={{ ml: 2, color: 'primary.main' }} />
									<Text as="span" size="sm" colorKey="text.secondary">
										{p.commentsCount ?? 0}
									</Text>
								</Box>
							</Paper>
						);
				})
				)}
			</Box>
		</DashboardCard>
	);
};

export default TopPostsPanel;

