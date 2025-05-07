// src/ui/components/centerAlert/AdminNotifications.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Container,
	Title,
	FormControl,
	StyledSelect,
	MessageInput,
	SendButton,
} from './adminNotifications.styles';
import { MenuItem, Typography } from '@mui/material';

interface User {
	_id: string;
	username: string;
}

const AdminNotifications: React.FC = () => {
	const [message, setMessage] = useState('');
	const [recipients, setRecipients] = useState<string>('all');
	const [users, setUsers] = useState<User[]>([]);
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUsers(response.data.list);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};

		fetchUsers();
	}, [HOST, SERVICE, token]);

	const sendNotification = async () => {
		try {
			const notificationData = {
				message,
				type: 'admin',
				recipients: recipients === 'all' ? 'all' : recipients,
			};

			await axios.post(`${HOST}${SERVICE}/notifications`, notificationData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setMessage('');
			alert(`Notificación enviada a ${recipients === 'all' ? 'todos los usuarios' : 'el usuario seleccionado'}`);
		} catch (error) {
			console.error('Error sending notification:', error);
		}
	};

	return (
		<Container>
			<Title>Enviar Notificación</Title>
			<FormControl>
				<Typography variant="body1">Enviar a:</Typography>
				<StyledSelect
					value={recipients}
					onChange={(e) => setRecipients(e.target.value as string)}

					variant="outlined"
				>
					<MenuItem value="all">Todos los usuarios</MenuItem>
					{users.map((user) => (
						<MenuItem key={user._id} value={user._id}>
							{user.username}
						</MenuItem>
					))}
				</StyledSelect>
			</FormControl>
			<FormControl>
				<MessageInput
					label="Mensaje de la notificación"
					multiline
					rows={4}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					variant="outlined"
				/>
			</FormControl>
			<SendButton variant="contained" onClick={sendNotification}>
				Enviar
			</SendButton>
		</Container>
	);
};

export default AdminNotifications;

