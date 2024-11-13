// Notifications.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';
import { useNavigate } from 'react-router-dom';
import {
	NotificationContainer,
	NotificationList,
	NotificationItem,
	NotificationMessage,
	ActionButton
} from './notifications.styles';

interface Notification {
	_id: string;
	recipient: string;
	sender: string;
	type: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	data?: {
		publicationId?: string;
		commentId?: string;
	};
}

const Notifications: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/notifications`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setNotifications(response.data.notifications || []);
			} catch (error) {
				console.error('Error fetching notifications:', error);
			}
		};

		fetchNotifications();
	}, [HOST, SERVICE, token]);

	useEffect(() => {
		if (!token) return;

		const socket: Socket = io(HOST, {
			auth: {
				token,
			},
		});

		socket.on('new-notification', (notification: Notification) => {
			setNotifications((prev) => [notification, ...prev]);
		});

		return () => {
			socket.off('new-notification');
			socket.close();
		};
	}, [HOST, token]);

	const deleteNotification = async (notificationId: string) => {
		try {
			await axios.delete(`${HOST}${SERVICE}/notifications/${notificationId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
		} catch (error) {
			console.error('Error al eliminar la notificación:', error);
		}
	};

	const markAsRead = async (notificationId: string) => {
		try {
			await axios.put(`${HOST}${SERVICE}/notifications/${notificationId}/read`, {}, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setNotifications((prev) =>
							 prev.map((notif) =>
									  notif._id === notificationId ? { ...notif, isRead: true } : notif
									 )
							);
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	const handleNotificationClick = async (notification: Notification) => {
		// Marca la notificación como leída
		await markAsRead(notification._id);

		// Redirige según el tipo de notificación
		if (notification.type === 'comment' && notification.data?.publicationId) {
			navigate(`/publications/${notification.data.publicationId}`);
		} else if (notification.type === 'friend_request') {
			navigate(`/profile/${notification.sender}`);
		}
	};

	return (
		<NotificationContainer>
			<NotificationList>
				{notifications.map((notification) => (
					<NotificationItem
						key={notification._id}
						isRead={notification.isRead}
						onClick={() => handleNotificationClick(notification)}
					>
						<NotificationMessage>{notification.message}</NotificationMessage>
						<ActionButton
							onClick={(e) => {
								e.stopPropagation();
								deleteNotification(notification._id);
							}}
						>
							Eliminar
						</ActionButton>
					</NotificationItem>
				))}
			</NotificationList>
		</NotificationContainer>
	);
};

export default Notifications;

