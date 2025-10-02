// src/ui/components/platform/sections/NewMessagesPanel.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Badge, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AvatarX      from '../../../shared/atoms/avatar/AvatarX';
import Text         from '../../../shared/atoms/typography/Text';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';

import { get } from '../../../../async/api';
import getEnvVariables from '../../../../config/configEnvs';
import DashboardCard from './DashboardCard';

const { HOST, SERVICE } = getEnvVariables();

interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
}

interface ConversationPreview {
	_id: string;
	isGroup: boolean;
	user: User;         
	lastMessage: string;
	createdAt: string; 
	unread: number;   
}

const NewMessagesPanel: React.FC = () => {
	const navigate = useNavigate();
	const [busy, setBusy] = useState(false);
	const [convs, setConvs] = useState<ConversationPreview[]>([]);

	useEffect(() => {
		const fetchConvs = async () => {
			setBusy(true);
			try {
				const { conversations } = await get<{ conversations: ConversationPreview[] }>(
					`${HOST}${SERVICE}/messages/unread`,
					{},
				);
				setConvs(conversations ?? []);
			} catch (e) {
				console.error('Error obteniendo conversaciones', e);
				setConvs([]);
			} finally {
				setBusy(false);
			}
		};
		fetchConvs();
	}, []);

	const previews = convs
	.filter(c => c.unread > 0)
	.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	.slice(0, 3);

	return (
		<DashboardCard>
			<Box>
				{/* Encabezado */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Text as="h3" headingLevel="h3" system="sans" colorKey="text.primary">
						Nuevos mensajes
					</Text>
					<Button variant="text" size="small" onClick={() => navigate('/message')}>
						Abrir chat
					</Button>
				</Box>

				{/* Contenido */}
				{busy && !previews.length ? (
					// Skeletons de carga
					<>
						{[0, 1, 2].map(i => (
							<Paper
								key={i}
								sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
								elevation={0}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Skeleton variant="circular" width={28} height={28} />
									<Box sx={{ flex: 1 }}>
										<Skeleton variant="text" width="40%" height={18} />
										<Skeleton variant="text" width="80%" height={16} />
									</Box>
									<Skeleton variant="text" width={48} height={16} />
								</Box>
							</Paper>
						))}
					</>
				) : !previews.length ? (
					<Text size="sm" colorKey="neutral.graySoft.600">
						No tienes mensajes nuevos.
					</Text>
				) : (
				previews.map(c => {
					const avatar = c.user.profile?.profilePicture
						? `${HOST}/${c.user.profile.profilePicture}`
						: undefined; // AvatarX ya podría manejar fallback

						return (
							<Paper
								key={c._id}
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
								onClick={() => navigate('/message', { state: { chatId: c._id, isGroup: c.isGroup } })}
								role="button"
								aria-label={`Abrir conversación con ${c.user.username}`}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
									<Badge
										badgeContent={c.unread > 99 ? '99+' : c.unread}
										color="primary"
										overlap="circular"
										sx={{
											'& .MuiBadge-badge': {
												fontSize: '0.65rem',
												minWidth: 20,
												height: 18,
										},
										}}
									>
										<AvatarX src={avatar} size="sm" />
									</Badge>

									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Text as="div" size="sm" weight="bold" colorKey="text.primary">
											{c.user.username}
										</Text>
										<Text
											as="div"
											size="sm"
											colorKey="text.secondary"
											sx={{
												mt: 0.25,
												display: '-webkit-box',
												WebkitLineClamp: 1,
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
											title={c.lastMessage}
										>
											{c.lastMessage}
										</Text>
									</Box>

									<DateTimeInfo timestamp={c.createdAt} size="small" />
								</Box>
							</Paper>
						);
				})
				)}
			</Box>
		</DashboardCard>
	);
};

export default NewMessagesPanel;

