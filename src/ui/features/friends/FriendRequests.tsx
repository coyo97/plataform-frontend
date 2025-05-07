// src/ui/components/profile/FriendRequests.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
    FriendRequestsContainer,
    RequestList,
    RequestItem,
    UserName,
    ActionButtons,
    StyledButton,
} from './friendRequestsStyles.styles';
import { Typography } from '@mui/material';

interface User {
	_id: string;
	username: string;
	email: string;
}

const FriendRequests: React.FC = () => {
	const [list, setList] = useState<User[]>([]);
	const [message, setMessage] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchFriendRequests = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users/friend-requests`, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});
				if (response.data && response.data.friendRequests) {
					setList(response.data.friendRequests);
				} else {
					console.error('La respuesta no contiene las solicitudes de amistad esperadas.');
				}
			} catch (error) {
				console.error('Error al obtener las solicitudes de amistad:', error);
			}
		};
		fetchFriendRequests();
	}, [HOST, SERVICE]);

	const handleAcceptRequest = async (id: string) => {
		try {
			await axios.post(
				`${HOST}${SERVICE}/users/${id}/accept-friend-request`,
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);
			setMessage('Solicitud aceptada');
			setList(list.filter((req) => req._id !== id));
		} catch (error) {
			console.error('Error al aceptar la solicitud:', error);
			setMessage('Error al aceptar la solicitud');
		}
	};

	const handleRejectRequest = async (id: string) => {
		try {
			await axios.post(
				`${HOST}${SERVICE}/users/${id}/reject-friend-request`,
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);
			setMessage('Solicitud rechazada');
			setList(list.filter((req) => req._id !== id));
		} catch (error) {
			console.error('Error al rechazar la solicitud:', error);
			setMessage('Error al rechazar la solicitud');
		}
	};

	return (
		<FriendRequestsContainer>
			<Typography variant="h5" component="h1">Solicitudes de Amistad</Typography>
			{message && <Typography color="primary">{message}</Typography>}
			<RequestList>
				{list.map((request) => (
					<RequestItem key={request._id}>
						<UserName variant="body1">{request.username}</UserName>
						<ActionButtons>
							<StyledButton onClick={() => handleAcceptRequest(request._id)}>Aceptar</StyledButton>
							<StyledButton onClick={() => handleRejectRequest(request._id)} color="secondary">Rechazar</StyledButton>
						</ActionButtons>
					</RequestItem>
				))}
			</RequestList>
		</FriendRequestsContainer>
	);
};

export default FriendRequests;

