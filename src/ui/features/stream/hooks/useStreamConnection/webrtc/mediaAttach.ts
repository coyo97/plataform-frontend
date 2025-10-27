export function attachStreamToVideo(elId: string, stream: MediaStream) {
	const el = document.getElementById(elId) as HTMLVideoElement | null;
	if (!el) return;
	if (el.srcObject !== stream) {
		el.srcObject = stream;
		el.onloadedmetadata = () => el.play().catch(() => {});
	}
}

