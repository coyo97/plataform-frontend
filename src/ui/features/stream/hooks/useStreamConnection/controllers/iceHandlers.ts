// src/ui/features/stream/hooks/useStreamConnection/controllers/iceHandlers.ts
type Ctx = {
	isStreamer: boolean;
	signaling: {
		onIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
		onScreenIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
	};
	storeRef: React.MutableRefObject<{
		perViewer: Record<string, RTCPeerConnection>;
		perStreamer: Record<string, RTCPeerConnection>;
	}>;
	screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
	safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;

	// Viewer → Owner (cuando el viewer envía pantalla)
	viewerOutScreenPcRef?: React.MutableRefObject<RTCPeerConnection | undefined>;
	ownerSocketIdRef?: React.MutableRefObject<string | undefined>;
};

export function setupIceHandlers(ctx: Ctx) {
	const {
		isStreamer,
		signaling,
		storeRef,
		screenPCsRef,
		pendingScreenCandidatesRef,
		safeAddIce,
		viewerOutScreenPcRef,
		ownerSocketIdRef,
	} = ctx;

	// De-dup para no aplicar el mismo ICE dos veces
	const seenCamIce = new Set<string>();
	const seenScreenIce: Record<string, Set<string>> = {};

	const iceKey = (c: RTCIceCandidateInit) =>
		`${c.sdpMid ?? ''}|${c.sdpMLineIndex ?? ''}|${c.candidate ?? ''}`;

	// === ICE de cam/mic ===
	const offCamIce = signaling.onIce(async ({ from, candidate }) => {
		const pc = isStreamer
			? storeRef.current.perViewer?.[from]
			: storeRef.current.perStreamer?.[from];

			if (!pc) {
				console.log('[[ICE]] cam ICE sin PC objetivo from=%s (race)', from);
				return;
			}

			const key = iceKey(candidate);
			if (seenCamIce.has(key)) return;
			seenCamIce.add(key);

			try {
				await safeAddIce(pc, candidate);
				console.log('[[ICE]] cam add OK from=%s', from);
			} catch (e) {
				console.warn('[[ICE]] cam add FAIL from=%s', from, e);
			}
	});

	// === ICE de screen-share ===
	const offScreenIce = signaling.onScreenIce(async ({ candidate, from }) => {
		if (!from) return;

		const key = iceKey(candidate);
		if (!seenScreenIce[from]) seenScreenIce[from] = new Set<string>();
		if (seenScreenIce[from].has(key)) return;
		seenScreenIce[from].add(key);

		// 1) Caso normal: host empuja pantalla a viewer 'from'
		let pc = screenPCsRef.current[from];

		// 2) Fallback: viewer enviando pantalla hacia el owner
		if (!pc && !isStreamer && viewerOutScreenPcRef?.current) {
			const ownerId = ownerSocketIdRef?.current;
			const matchesOwner = !ownerId || ownerId === from; // si desconocemos owner, asumimos que 'from' es el owner
			if (matchesOwner) {
				console.log('[[ICE][VIEWER→OWNER]] usando viewerOutScreenPcRef para from=%s', from);
				pc = viewerOutScreenPcRef.current;
				if (pc && pc.signalingState !== 'closed') {
					// mapeo para futuros ICE
					screenPCsRef.current[from] = pc;
				}
			}
		}

		if (!pc) {
			console.log('[[ICE]] screen ICE sin PC (from=%s) → buffer', from);
			(pendingScreenCandidatesRef.current[from] ||= []).push(candidate);
			return;
		}

		try {
			await safeAddIce(pc, candidate);
			console.log('[[ICE]] screen add OK for from=%s', from);
		} catch (e) {
			console.warn('[[ICE]] screen add FAIL for from=%s', from, e);
			(pendingScreenCandidatesRef.current[from] ||= []).push(candidate);
		}
	});

	return () => {
		try { (offCamIce as any)?.(); } catch {}
		try { (offScreenIce as any)?.(); } catch {}
	};
}

