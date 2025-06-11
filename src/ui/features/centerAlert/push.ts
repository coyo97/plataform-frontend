// Detecta permisos y lanza el toast nativo
export async function showPush(title: string, options?: NotificationOptions) {
	if (!("Notification" in window)) return;

	const perm = Notification.permission === "granted"
		? "granted"
		: await Notification.requestPermission();

		if (perm === "granted") new Notification(title, options);
}

