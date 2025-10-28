type Ctx = {
	isStreamer: boolean;
	signaling: {
		onAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;
		onScreenAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
	};
	storeRef: React.MutableRefObject<any>;
	lastOfferPcRef: React.MutableRefObject<RTCPeerConnection | null>;
	screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
	safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;
};

export function setupAnswersHandlers(ctx: Ctx) {
	const {
		isStreamer,
		signaling,
		storeRef,
		lastOfferPcRef,
		screenPCsRef,
		pendingScreenCandidatesRef,
		safeAddIce,
	} = ctx;

	const onAnsMaybe = signaling.onAnswer(async (payload) => {
		if (!isStreamer) return;
		const answer = payload?.answer ?? (payload as any);
		const from = (payload as any)?.from as string | undefined;

		console.log('[[CLT]] onAnswer from=%s type=%s', from ?? '(broadcast)', answer?.type);

		if (from) {
			const pc = storeRef.current.perViewer[from];
			if (pc) {
				if (pc.signalingState !== 'have-local-offer') {
					console.warn('[[CLT]] ignoring duplicate/late answer from=%s, signaling=%s', from, pc.signalingState);
					return;
				}
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(answer));
					console.log('[[CLT]] setRemoteDescription OK (dirigida) from=%s', from);
				} catch (e) {
					console.warn('[[CLT]] setRemoteDescription (dirigida) error', e);
				}
				return;
			}
		}

		if (lastOfferPcRef.current) {
			const pc = lastOfferPcRef.current;
			if (pc.signalingState !== 'have-local-offer') {
				console.warn('[[CLT]] ignoring broadcast answer (no have-local-offer), signaling=%s', pc.signalingState);
				return;
			}
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('[[CLT]] setRemoteDescription OK (broadcast fallback)');
			} catch (e) {
				console.warn('[[CLT]] Fallback ANSWER error', e);
			}
		}
	});

	const onScrAnsMaybe = signaling.onScreenAnswer(async ({ answer, from }) => {
		console.log('[[CLT]] onScreenAnswer from=%s type=%s', from ?? '(unknown)', answer?.type);
		if (!from) return;

		const pc = screenPCsRef.current[from];
		if (!pc) {
			console.log('[[CLT]] screenPC inexistente para from=%s; esperando ICE/rehacer si es necesario', from);
			return;
		}

		if (pc.signalingState === 'have-local-offer') {
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('[[CLT]] screenPC setRemoteDescription OK (from=%s)', from);
				const pend = pendingScreenCandidatesRef.current[from] ?? [];
				for (const c of pend) await safeAddIce(pc, c);
				pendingScreenCandidatesRef.current[from] = [];
			} catch (e) {
				console.warn('[[CLT]] screenPC setRemoteDescription error (from=%s)', from, e);
			}
		}
	});

	return () => {
		if (typeof onAnsMaybe === 'function') onAnsMaybe();
		if (typeof onScrAnsMaybe === 'function') onScrAnsMaybe();
	};
}

