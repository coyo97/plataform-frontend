import { get, post, del, put } from "../api";
import getEnvVariables from "../../config/configEnvs";
import * as R from "../routes/notificationRoutes";
import { Notification } from "../../types/notification";
import type { Socket } from "socket.io-client";

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

/* ---------- HTTP ---------- */
export const listNotifications = () =>
	get<{ notifications: Notification[] }>(url(R.NOTIFICATIONS), {})
.then(r => r.notifications);

export const deleteNotification = (id: string) =>
	del<void>(url(R.NOTIFICATION(id)));

export const markAsRead = (id: string) =>
	put<void>(url(R.MARK_AS_READ(id)), {});

export const sendAdminNotification = (payload: {
	message: string; type: "admin"; recipients: string | "all";
}) => post<void>(url(R.NOTIFICATIONS), payload);

/* ---------- WebSocket ---------- */
const WS_EVENT = "new-notification";

export const registerNotificationEvents = (
	socket: Socket,
	add: (n: Notification) => void,
): (() => void) => {
	const handler = (notif: Notification) => add(notif);
	socket.on(WS_EVENT, handler);
	return () => socket.off(WS_EVENT, handler);
};


