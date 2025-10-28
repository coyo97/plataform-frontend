// src/ui/features/stream/hooks/useStreamConnection/controllers/acceptViewerCamOffer.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		onOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		emitAnswer: (answer: RTCSessionDescriptionInit, to: string) => void;
		emitIce: (cand: RTCIceCandidateInit, to: string) => void;
	};
	storeRef: React.MutableRefObject<{
		perViewer: Record<string, RTCPeerConnection>;
	}>;
};

export function setupAcceptViewerCamOffer(ctx: Ctx) {
	const { isStreamer, signaling, storeRef } = ctx;

	if (!isStreamer) return () => {};

	const offMaybe = signaling.onOffer(async ({ offer, from }) => {
		// Si esta oferta viene de un viewer (no del propio streamer)
		// Creamos o reusamos el PC dedicado para ese viewer y respondemos.
		let pc = storeRef.current.perViewer[from];
		if (!pc || pc.signalingState === 'closed') {
			pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitIce(e.candidate, from),
				onTrack: () => {
					// si el viewer manda audio/video hacia el streamer y quieres reproducirlo, adjúntalo aquí
				},
			});
			storeRef.current.perViewer[from] = pc;
		}

		await pc.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await pc.createAnswer();
		await pc.setLocalDescription(answer);
		signaling.emitAnswer(answer, from);
	});

	return () => {
		if (typeof offMaybe === 'function') offMaybe();
	};
}

