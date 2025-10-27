export type PCOpts = {
	iceServers?: RTCIceServer[];
	onIce?: (c: RTCPeerConnectionIceEvent) => void;
	onTrack?: (ev: RTCTrackEvent) => void;
};

export function createPeerConnection(opts: PCOpts) {
	const pc = new RTCPeerConnection({
		iceServers: opts.iceServers ?? [{ urls: 'stun:stun.l.google.com:19302' }],
	});
	if (opts.onIce)   pc.onicecandidate = opts.onIce;
	if (opts.onTrack) pc.ontrack = opts.onTrack;
	return pc;
}

