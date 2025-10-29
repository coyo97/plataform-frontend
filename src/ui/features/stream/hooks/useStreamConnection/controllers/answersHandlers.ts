// controllers/answersHandlers.ts
type Ctx = {
	isStreamer: boolean;
	signaling: {
		onAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;
		onScreenAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		onIce?: (cb: (payload: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
		onScreenIce?: (cb: (payload: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
	};
	storeRef: React.MutableRefObject<{
		perViewer: Record<string, RTCPeerConnection>;
		perStreamer: Record<string, RTCPeerConnection>;
	}>;
	lastOfferPcRef: React.MutableRefObject<RTCPeerConnection | null>; // ya no se usa para broadcast
	screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
	safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit, pending?: RTCIceCandidateInit[]) => Promise<void>;
	viewerOutScreenPcRef?: React.MutableRefObject<RTCPeerConnection | null | undefined>;
	ownerSocketIdRef?: React.MutableRefObject<string | undefined>;
};

export function setupAnswersHandlers(ctx: Ctx) {
	const {
		isStreamer,
		signaling,
		storeRef,
		screenPCsRef,
		pendingScreenCandidatesRef,
		safeAddIce,
		viewerOutScreenPcRef,
	} = ctx;

	// Buffer local para ICE de pantalla del VIEWER si llega antes del PC (lado viewer saliente)
	const pendingViewerScreenIce: RTCIceCandidateInit[] = [];

	/* ── ANSWER cam/mic (ruta normal, siempre dirigida con from) ── */
	const offAns = signaling.onAnswer(async ({ answer, from }) => {
		if (!from) return;

		if (isStreamer) {
			const pc = storeRef.current.perViewer?.[from];
			if (!pc) {
				console.warn('[[ANS]] (host) no perViewer PC for from=%s', from);
				return;
			}
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('[[ANS]] (host) setRemoteDescription OK from=%s', from);
			} catch (e) {
				console.warn('[[ANS]] (host) setRemoteDescription fail from=%s', from, e);
			}
		} else {
			const pc = storeRef.current.perStreamer?.[from];
			if (!pc) {
				console.warn('[[ANS]] (viewer) no perStreamer PC for from=%s', from);
				return;
			}
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('[[ANS]] (viewer) setRemoteDescription OK from=%s', from);
			} catch (e) {
				console.warn('[[ANS]] (viewer) setRemoteDescription fail from=%s', from, e);
			}
		}
	});

	/* ── ANSWER de compartir pantalla ── */
	const offScreenAns = signaling.onScreenAnswer(async ({ answer, from }) => {
		if (!from) return;

		// Host empujando pantalla hacia "from"
		const pcHostOut = screenPCsRef.current[from];
		if (pcHostOut && pcHostOut.signalingState !== 'closed') {
			try {
				await pcHostOut.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('[[ANS-SCREEN]] (host) setRemoteDescription OK from=%s', from);
				const pend = pendingScreenCandidatesRef.current[from] ?? [];
				if (pend.length) {
					for (const c of pend) await safeAddIce(pcHostOut, c);
					pendingScreenCandidatesRef.current[from] = [];
				}
			} catch (e) {
				console.warn('[[ANS-SCREEN]] (host) setRemoteDescription fail from=%s', from, e);
			}
			return;
		}

		// Viewer compartiendo hacia host (respuesta del host al viewer)
		const viewerOut = viewerOutScreenPcRef?.current ?? null;
		if (viewerOut && viewerOut.signalingState !== 'closed') {
			try {
				await viewerOut.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('[[ANS-SCREEN]] (viewer) setRemoteDescription OK from=%s', from);
				if (pendingViewerScreenIce.length) {
					for (const c of pendingViewerScreenIce.splice(0)) await safeAddIce(viewerOut, c);
				}
			} catch (e) {
				console.warn('[[ANS-SCREEN]] (viewer) setRemoteDescription fail from=%s', from, e);
			}
		}
	});

	/* ── ICE cam/mic (opcional si tu signaling lo emite por este canal) ── */
	const offIce =
		typeof signaling.onIce === 'function'
			? signaling.onIce(async ({ from, candidate }) => {
				if (!from || !candidate) return;
				const pc = isStreamer
					? storeRef.current.perViewer?.[from]
					: storeRef.current.perStreamer?.[from];
					if (!pc || pc.signalingState === 'closed') return;
					try { await safeAddIce(pc, candidate); } catch (e) { console.warn('[[ICE]] cam add fail', e); }
			})
				: undefined;

				/* ── ICE screen-share (opcional) ── */
				const offScreenIce =
					typeof signaling.onScreenIce === 'function'
						? signaling.onScreenIce(async ({ from, candidate }) => {
							if (!from || !candidate) return;

							// Host empujando pantalla a "from"
							const pcHostOut = screenPCsRef.current[from];
							if (pcHostOut && pcHostOut.signalingState !== 'closed') {
								try { await safeAddIce(pcHostOut, candidate, pendingScreenCandidatesRef.current[from]); }
								catch (e) { console.warn('[[ICE]] (host) screen add fail', e); }
								return;
							}

							// Viewer saliendo a host (buffer si aún no existe viewerOutScreenPcRef)
							const viewerOut = viewerOutScreenPcRef?.current ?? null;
							if (!viewerOut) {
								pendingViewerScreenIce.push(candidate);
								console.warn('[[ICE]] (viewer) buffer early screen ICE from=%s', from);
								return;
							}
							try { await safeAddIce(viewerOut, candidate, pendingViewerScreenIce); }
							catch (e) { console.warn('[[ICE]] (viewer) screen add fail', e); }
						})
							: undefined;

							return () => {
								try { (offAns as any)?.(); } catch {}
								try { (offScreenAns as any)?.(); } catch {}
								try { (offIce as any)?.(); } catch {}
								try { (offScreenIce as any)?.(); } catch {}
							};
}

