export async function startPublisherMedia(): Promise<MediaStream> {
	return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}

export async function startViewerMic(): Promise<MediaStream> {
	return navigator.mediaDevices.getUserMedia({ audio: true });
}

export function stopTracks(ms?: MediaStream | null) {
	ms?.getTracks()?.forEach(t => t.stop());
}

