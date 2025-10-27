export type PeerStore = {
	publisher?: RTCPeerConnection;                    // streamer cam/mic (broadcast opcional)
	screenPublisher?: RTCPeerConnection;              // streamer screen
	perViewer: Record<string, RTCPeerConnection>;     // streamer -> viewer PC
	perStreamer: Record<string, RTCPeerConnection>;   // viewer -> streamer PC
};

export function createPeerStore(): PeerStore {
	return { perViewer: {}, perStreamer: {} };
}

export function closeAndDelete(pc?: RTCPeerConnection | null) {
	try { pc?.getSenders().forEach(s => s.track?.stop()); } catch {}
	try { pc?.close(); } catch {}
}

export function closeAll(store: PeerStore) {
	closeAndDelete(store.publisher);
	closeAndDelete(store.screenPublisher);
	Object.values(store.perViewer).forEach(closeAndDelete);
	Object.values(store.perStreamer).forEach(closeAndDelete);
}

