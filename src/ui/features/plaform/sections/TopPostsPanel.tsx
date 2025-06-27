import React, { useEffect } from 'react';
import {
	Box, Button, Paper, Typography,
} from '@mui/material';
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

/* helper: likes primero, luego comentarios */
const sortByPopularity = (a: Publication, b: Publication) => {
	const diffLikes = (b.likes?.length ?? 0) - (a.likes?.length ?? 0);
	return diffLikes !== 0
		? diffLikes
		: (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
};

const TopPostsPanel: React.FC = () => {
	const navigate = useNavigate();

	/* hook con parámetros obligatorios */
	const {
		pubs = [],
		busy,
		load,
	} = usePublicationsFeed({
		filter: 'mostLiked',
		careerId: '',
		query: '',
	});

	/* carga inicial */
	useEffect(() => {
		if (!pubs.length) load(1);        // primera página
	}, [pubs.length, load]);

	/* top 3 */
	const top = [...pubs].sort(sortByPopularity).slice(0, 3);

	return (
		<DashboardCard>
			<Box>
				{/* encabezado */}
				<Box sx={{
					display:'flex', justifyContent:'space-between', alignItems:'center', mb:2,
					}}>
					<Typography variant="h6" fontWeight="bold">
						Publicaciones destacadas
					</Typography>
					<Button variant="text" size="small" onClick={() => navigate('/publications')}>
						Ver todas
					</Button>
				</Box>

				{/* contenido */}
				{busy && !pubs.length ? (
					<Typography variant="body2">Cargando…</Typography>
				) : !top.length ? (
					<Typography variant="body2">No hay publicaciones populares.</Typography>
				) : (
				top.map((p) => {
					const avatar = p.author?.profile?.profilePicture
						? `${HOST}/${p.author.profile.profilePicture}`
						: undefined;

						return (
							<Paper
								key={p._id}
								sx={{ p:2, mb:2, cursor:'pointer' }}
								elevation={1}
								onClick={() => navigate(`/publications/${p._id}`)}
							>
								{/* autor + fecha */}
								<Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
									<AvatarX src={avatar} size="sm" />
									<Text weight="bold">{p.author?.username ?? 'Usuario'}</Text>
									<DateTimeInfo timestamp={p.created_at} size="small" />
								</Box>

								{/* título o fragmento */}
								<Text size="sm" weight="bold" sx={{ mt:0.5 }}>
									{p.title || p.content?.slice(0, 80) || '(Sin contenido)'}
								</Text>

								{/* stats */}
								<Box sx={{ display:'flex', alignItems:'center', gap:1, mt:1 }}>
									<Favorite fontSize="small" />
									<Text size="sm">{p.likes?.length ?? 0}</Text>
									<ChatBubble fontSize="small" sx={{ ml:2 }} />
									<Text size="sm">{p.commentsCount ?? 0}</Text>
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

