import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

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
		<div>
			<h3>Enviar Notificación</h3>
			<div>
				<label>
					Enviar a:
					<select value={recipients} onChange={(e) => setRecipients(e.target.value)}>
						<option value="all">Todos los usuarios</option>
						{users.map((user) => (
							<option key={user._id} value={user._id}>
								{user.username}
							</option>
						))}
					</select>
				</label>
			</div>
			<textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Mensaje de la notificación"
			/>
			<button onClick={sendNotification}>Enviar</button>
		</div>
	);
};

export default AdminNotifications;

