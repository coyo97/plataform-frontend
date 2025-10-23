// src/ui/components/notifications/Notifications.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	NotificationContainer,
	NotificationList,
	NotificationItem,
	NotificationMessage,
	ActionButton,
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
	const socket = useSocket();
	const navigate = useNavigate();

	/* ===== Carga inicial ===== */
	useEffect(() => {
		listNotifications()
		.then(setNotifications)
		.catch(console.error);
	}, []);

	/* ===== Tiempo real (Socket) ===== */
	useEffect(() => {
		registerNotificationEvents(socket, (n) => {
			setNotifications((prev) => [n, ...prev]);
			showPush("Nueva notificación", { body: n.message });
		});
	}, [socket]);

	/* ===== Handlers ===== */
	const handleDelete = async (id: string) => {
		try {
			await deleteNotification(id);
		} finally {
			setNotifications((prev) => prev.filter((n) => n._id !== id));
		}
	};

	const handleClick = async (n: Notification) => {
		await markAsRead(n._id);
		setNotifications((prev) =>
						 prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
						);

						// navegación según tipo
						if (n.type === "comment" && n.data?.publicationId) {
							navigate(`/publications/${n.data.publicationId}`);
						} else if (n.type === "friend_request") {
							navigate(`/profile/${n.sender}`);
						} else if (n.type === "report_alert" && n.data?.publicationId) {
							navigate(`/publications/${n.data.publicationId}`);
						}
	};

	/* ===== Render ===== */
	return (
		<NotificationContainer>
			<NotificationList>
				{notifications.map((n) => (
					<NotificationItem
						key={n._id}
						isRead={n.isRead}
						onClick={() => handleClick(n)}
						style={
							n.type === "report_alert"
								? {
									borderLeft: "4px solid #f44336",
									backgroundColor: "#fff6f6",
								}
								: {}
						}
					>
						<NotificationMessage>
							{n.type === "report_alert" ? "⚠️ " : ""}
							{n.message}
						</NotificationMessage>

						<ActionButton
							onClick={(e) => {
								e.stopPropagation();
								handleDelete(n._id);
							}}
						>
							Eliminar
						</ActionButton>
					</NotificationItem>
				))}
				{!notifications.length && (
					<NotificationMessage style={{ opacity: 0.6, textAlign: "center" }}>
						No tienes notificaciones.
					</NotificationMessage>
				)}
			</NotificationList>
		</NotificationContainer>
	);
};

export default Notifications;

