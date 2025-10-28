type Ctx = {
	isStreamer: boolean;
	signaling: {
		onRequestScreenShare: (cb: (p: { viewerSocketId: string }) => void) => unknown;
		onStopScreenShare?: (cb: () => void) => unknown;
	};
	screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
	sendDirectScreenOfferTo: (viewerSocketId: string) => Promise<void>;
};

export function setupScreenSender(ctx: Ctx) {
	const { isStreamer, signaling, screenPCsRef, pendingScreenCandidatesRef, sendDirectScreenOfferTo } = ctx;

	let unbindReqMaybe: unknown;
	let unbindStopMaybe: unknown;

	if (isStreamer) {
		unbindReqMaybe = signaling.onRequestScreenShare(({ viewerSocketId }) => {
			console.log('[[CLT]] onRequestScreenShare viewer=%s', viewerSocketId);
			sendDirectScreenOfferTo(viewerSocketId);
		});

		if (signaling.onStopScreenShare) {
			unbindStopMaybe = signaling.onStopScreenShare(() => {
				console.log('[[STREAMER]] stop-screen-share → closing screen PCs');
				Object.values(screenPCsRef.current).forEach(pc => { try { pc.close(); } catch {} });
				screenPCsRef.current = {};
				pendingScreenCandidatesRef.current = {};
			});
		}
	}

	return () => {
		if (typeof unbindReqMaybe === 'function') unbindReqMaybe();
		if (typeof unbindStopMaybe === 'function') unbindStopMaybe();
	};
}

