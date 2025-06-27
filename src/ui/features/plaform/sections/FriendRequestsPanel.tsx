import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Paper,
	Button,
	Typography,
} from '@mui/material';

import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import Text from '../../../shared/atoms/typography/Text';
import { useFriendRequests } from '../../../features/friends/hooks/useFriendRequests';
import DashboardCard from './DashboardCard';


const FriendRequestsPanel: React.FC = () => {
	const navigate = useNavigate();
	const { list, accept, reject } = useFriendRequests();

	if (!list.length) return null; 

	return (
		<DashboardCard>
			<Box>
				{/* Título del panel */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Typography variant="h6" fontWeight="bold">Solicitudes de amistad</Typography>
					<Button size="small" variant="text" onClick={() => navigate('/friend-requests')}>
						Ver todas
					</Button>
				</Box>

				{/* Lista de solicitudes */}
				{list.slice(0, 3).map((user) => (
					<Paper key={user._id} sx={{ p: 2, mb: 2 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							{/*
							<AvatarX
								src={user.profile?.profilePicture
									? `/uploads/${user.profile.profilePicture}`
									: '/assets/default-avatar.png'}
								size="sm"
							/>
							  */}
							<Box sx={{ flex: 1 }}>
								<Text weight="bold">{user.username}</Text>
								<Text size="sm" colorKey="neutral.black.600">te envió una solicitud</Text>
							</Box>

							<Box sx={{ display: 'flex', gap: 1 }}>
								<Button size="small" color="success" variant="contained" onClick={() => accept(user._id)}>
									Aceptar
								</Button>
								<Button size="small" color="error" variant="outlined" onClick={() => reject(user._id)}>
									Rechazar
								</Button>
							</Box>
						</Box>
					</Paper>
				))}
			</Box>
		</DashboardCard>
	);
};

export default FriendRequestsPanel;

