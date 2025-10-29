// src/ui/features/stream/hooks/useStreamConnection/controllers/screenSender.ts
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
	const {
		isStreamer,
		signaling,
		screenPCsRef,
		pendingScreenCandidatesRef,
		sendDirectScreenOfferTo,
	} = ctx;

	let offReq: unknown;
	let offStop: unknown;

	// evita ráfagas de ofertas duplicadas
	const inFlightOfferTo: Record<string, boolean> = {};

	if (isStreamer) {
		offReq = signaling.onRequestScreenShare(async ({ viewerSocketId }) => {
			console.log('[SCRN][HOST] onRequestScreenShare → %s', viewerSocketId);

			if (inFlightOfferTo[viewerSocketId]) {
				console.log('[SCRN][HOST] skip: offer en curso para %s', viewerSocketId);
				return;
			}
			inFlightOfferTo[viewerSocketId] = true;

			try {
				await sendDirectScreenOfferTo(viewerSocketId);
				console.log('[SCRN][HOST] sendDirectScreenOfferTo OK → %s', viewerSocketId);
			} catch (err) {
				console.error('[SCRN][HOST] sendDirectScreenOfferTo FAIL → %s', viewerSocketId, err);
			} finally {
				inFlightOfferTo[viewerSocketId] = false;
			}
		});

		if (signaling.onStopScreenShare) {
			offStop = signaling.onStopScreenShare(() => {
				console.log('[SCRN][HOST] stop-screen-share → cerrar PCs de screen');
				Object.entries(screenPCsRef.current).forEach(([sid, pc]) => {
					try {
						console.log('[SCRN][HOST] closing screen PC → to=%s state=%s', sid, pc.connectionState);
						pc.close();
					} catch {}
				});
				screenPCsRef.current = {};
				pendingScreenCandidatesRef.current = {};
				Object.keys(inFlightOfferTo).forEach(k => delete inFlightOfferTo[k]);
			});
		}
	}

	return () => {
		try { (offReq as any)?.(); } catch {}
		try { (offStop as any)?.(); } catch {}
	};
}

