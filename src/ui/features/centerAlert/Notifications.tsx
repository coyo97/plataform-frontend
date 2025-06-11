import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	NotificationContainer, NotificationList, NotificationItem,
	NotificationMessage, ActionButton,
} from "./notifications.styles";
import { showPush } from "./push";

import {
	listNotifications,
	deleteNotification,
	markAsRead,
	registerNotificationEvents,
} from "../../../async/services/notificationService";
import { useSocket } from "../../providers/SocketProvider";
import { Notification } from "../../../types/notification";

const Notifications: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const socket        = useSocket();
	const navigate      = useNavigate();

	/* carga inicial */
	useEffect(() => {
		listNotifications().then(setNotifications).catch(console.error);
	}, []);

	/* tiempo real */
	useEffect(() =>
			  registerNotificationEvents(socket, n => {
		setNotifications(prev => [n, ...prev]);
		showPush("Nueva notificación", { body: n.message });   // 👈 push
	}),
	[socket]);
	/* handlers */
	const handleDelete = async (id: string) => {
		try { await deleteNotification(id); }
		finally {
			setNotifications(prev => prev.filter(n => n._id !== id));
		}
	};

	const handleClick = async (n: Notification) => {
		await markAsRead(n._id);
		setNotifications(prev =>
						 prev.map(x => x._id === n._id ? { ...x, isRead: true } : x));

		if (n.type === "comment" && n.data?.publicationId) {
			navigate(`/publications/${n.data.publicationId}`);
		} else if (n.type === "friend_request") {
			navigate(`/profile/${n.sender}`);
		}
	};

	/* UI */
	return (
		<NotificationContainer>
			<NotificationList>
				{notifications.map(n => (
					<NotificationItem
						key={n._id}
						isRead={n.isRead}
						onClick={() => handleClick(n)}
					>
						<NotificationMessage>{n.message}</NotificationMessage>
						<ActionButton
							onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
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

