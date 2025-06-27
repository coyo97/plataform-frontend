import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Typography,
	Paper,
	Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import Text from '../../../shared/atoms/typography/Text';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';

import { get }            from '../../../../async/api';            // helper que ya usas
import getEnvVariables    from '../../../../config/configEnvs';
const { HOST, SERVICE } = getEnvVariables();
import DashboardCard from './DashboardCard';


/* ---------- tipos locales ---------- */
interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
}

interface ConversationPreview {
	_id: string;                // id de la conversación (userId o groupId)
	isGroup: boolean;
	user: User;                 // autor del ÚLTIMO mensaje ( ≠ receptor)
	lastMessage: string;
	createdAt: string;          // fecha del último mensaje
	unread: number;             // mensajes no leídos en esta conversación
}

/* ---------- componente ---------- */
const NewMessagesPanel: React.FC = () => {
	const navigate = useNavigate();
	const [busy, setBusy] = useState(false);
	const [convs, setConvs] = useState<ConversationPreview[]>([]);

	/* carga inicial */
	useEffect(() => {
		const fetchConvs = async () => {
			setBusy(true);
			try {
				/* El backend debe exponer algo como: GET /messages/unread */
				const { conversations } = await get<{ conversations: ConversationPreview[] }>(
					`${HOST}${SERVICE}/messages/unread`,
					{},
				);
				setConvs(conversations);
			} catch (e) {
				console.error('Error obteniendo conversaciones', e);
			} finally {
				setBusy(false);
			}
		};
		fetchConvs();
	}, []);

	/* sólo con no leídos y máx. 3 */
	const previews = convs
	.filter(c => c.unread > 0)
	.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	.slice(0, 3);

	return (
		<DashboardCard>
			<Box>
				{/* Encabezado */}
				<Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
					<Typography variant="h6" fontWeight="bold">
						Nuevos mensajes
					</Typography>
					<Button variant="text" size="small" onClick={() => navigate('/message')}>
						Abrir chat
					</Button>
				</Box>

				{/* Contenido */}
				{busy && !previews.length ? (
					<Typography variant="body2">Cargando…</Typography>
				) : !previews.length ? (
					<Typography variant="body2">No tienes mensajes nuevos.</Typography>
				) : (
				previews.map(c => {
					const avatar =
						c.user.profile?.profilePicture
							? `${HOST}/${c.user.profile.profilePicture}`
							: 'https://ptetutorials.com/images/user-profile.png';

							return (
								<Paper
									key={c._id}
									sx={{ p:2, mb:2, cursor:'pointer' }}
									elevation={1}
									onClick={() =>
										navigate('/message', { state: { chatId: c._id, isGroup: c.isGroup } })
									}
								>
									<Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
										<Badge badgeContent={c.unread} color="primary">
											<AvatarX src={avatar} size="sm" />
										</Badge>

										<Box sx={{ flex:1, minWidth:0 }}>
											<Text weight="bold" >
												{c.user.username}
											</Text>
											<Text size="sm" colorKey="neutral.black.600" >
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

