// controllers/perViewerCam.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';
import { startViewerMic } from '../features/cameraMic';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		onOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		emitIce: (candidate: RTCIceCandidateInit, to: string) => void;                 
		emitAnswer: (answer: RTCSessionDescriptionInit, to: string) => void;          
	};
	storeRef: React.MutableRefObject<{
		perStreamer: Record<string, RTCPeerConnection>;
	}>;
	viewerMicRef: React.MutableRefObject<MediaStream | null>;
};

export function setupPerViewerCam(ctx: Ctx) {
	const { isStreamer, signaling, storeRef, viewerMicRef } = ctx;

	if (isStreamer) return () => {}; // este controlador es del VIEWER

	// Preparar mic del viewer (upstream opcional)
	startViewerMic()
	.then((ms) => {
		viewerMicRef.current = ms;
		console.log('[[VIEWER]] mic ready: a=%d', ms.getAudioTracks().length);
	})
	.catch((e) => console.error('[[VIEWER]] mic error', e));

	// Evitar múltiples respuestas por la misma offer
	const answeredOnceRef = { current: {} as Record<string, boolean> };

	const offOffer = signaling.onOffer(async ({ offer, from }) => {
		console.log('[[VIEWER]] onOffer from=%s type=%s', from, offer?.type);

		let pc = storeRef.current.perStreamer?.[from];
		if (!pc || pc.signalingState === 'closed' || pc.connectionState === 'failed') {
			pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitIce(e.candidate, from),
				onTrack: (ev) => {
					const [remote] = ev.streams;
					attachStreamToVideo('remoteVideo', remote);
					const el = document.getElementById('remoteVideo') as HTMLVideoElement | null;
					if (el) {
						el.style.display = 'block';
						el.muted = false;
						el.play?.().catch((err) => console.warn('[[VIEWER]] video.play() blocked', err));
					}
				},
			});
			storeRef.current.perStreamer = storeRef.current.perStreamer || {};
			storeRef.current.perStreamer[from] = pc;

			// (Opcional) enviar mic del viewer hacia el host
			viewerMicRef.current?.getAudioTracks().forEach((t) => {
				pc!.addTrack(t, viewerMicRef.current!);
				console.log('[[VIEWER]] addTrack mic → host=%s id=%s', from, t.id);
			});

			pc.onconnectionstatechange = () => {
				const st = pc!.connectionState;
				if (st === 'failed' || st === 'disconnected' || st === 'closed') {
					try { pc!.close(); } catch {}
					delete storeRef.current.perStreamer[from];
					answeredOnceRef.current[from] = false;
				}
			};
		}

		if (answeredOnceRef.current[from]) {
			console.log('[[VIEWER]] duplicate offer flow ignored for from=%s', from);
			return;
		}

		await pc!.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await pc!.createAnswer();
		await pc!.setLocalDescription(answer);
		answeredOnceRef.current[from] = true;

		console.log('[[VIEWER-SIG]] emitAnswer to=%s type=%s', from, answer.type);
		signaling.emitAnswer(answer, from);
	});

	return () => {
		try { (offOffer as any)?.(); } catch {}
	};
}

