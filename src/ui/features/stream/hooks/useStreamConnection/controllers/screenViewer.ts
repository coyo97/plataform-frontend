// src/ui/features/stream/hooks/useStreamConnection/controllers/screenViewer.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		emitScreenIce: (candidate: RTCIceCandidateInit, to: string) => void;
		emitScreenAnswer: (answer: RTCSessionDescriptionInit, to: string) => void;
		onStopScreenShare?: (cb: () => void) => unknown;
	};
	storeRef: React.MutableRefObject<any>;
	clearRemoteScreen: () => void;
};

export function setupScreenViewer(ctx: Ctx) {
	const { isStreamer, signaling, storeRef, clearRemoteScreen } = ctx;

	// El viewer recibe pantalla del streamer (slot 'screenPublisher').
	// El host no usa este controlador para ver viewers: usa screenFromViewer.
	const slotName = 'screenPublisher';

	const offOnScreenOffer = signaling.onScreenOffer(async ({ offer, from }) => {
		console.log(isStreamer
			? '[[HOST]] onScreenOffer (viewer→host) — este handler es para viewer, skip'
			: '[[VIEWER]] onScreenOffer from=%s type=%s', from, offer?.type);

			if (isStreamer) return; // host no atiende aquí pantallas de viewers

			// Asegura un PC válido
			let pc: RTCPeerConnection | undefined = storeRef.current[slotName];
			const makePc = () =>
				createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, from),
				onTrack: (ev) => {
					const [ms] = ev.streams;
					attachStreamToVideo('screenVideo', ms);
					const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
					if (el) {
						el.style.display = 'block';
						el.muted = false;
						el.playsInline = true;
						const p = el.play?.();
						if (p && typeof (p as any).catch === 'function') {
							(p as Promise<void>).catch((err) =>
													   console.warn('[[VIEWER]] video.play() blocked', err)
													  );
						}
					}
					ev.track.onended = () => clearRemoteScreen();
					ms.addEventListener('removetrack', () => {
						if (ms.getVideoTracks().length === 0) clearRemoteScreen();
					});
				},
			});

			if (!pc || pc.signalingState === 'closed') {
				pc = makePc();
				storeRef.current[slotName] = pc;
			} else if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
				try { pc.close(); } catch {}
				pc = makePc();
				storeRef.current[slotName] = pc;
			}

			// En este punto pc está definido
			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			if (pc.signalingState === 'have-remote-offer') {
				const ans: RTCSessionDescriptionInit = await pc.createAnswer();
				await pc.setLocalDescription(ans);
				console.log('[[VIEWER-SIG]] emitScreenAnswer to=%s type=%s', from, ans.type);
				signaling.emitScreenAnswer(ans, from);
			}

			pc.onconnectionstatechange = () => {
				const st = pc!.connectionState;
				console.log('[[VIEWER]] screen pc connectionState=', st);
				if (st === 'failed' || st === 'disconnected' || st === 'closed') {
					clearRemoteScreen();
				}
			};
	});

	let offStop: unknown;
	if (ctx.signaling.onStopScreenShare) {
		offStop = ctx.signaling.onStopScreenShare(() => {
			console.log('[[VIEWER]] stop-screen-share → clearRemoteScreen()');
			clearRemoteScreen();
		});
	}

	return () => {
		if (typeof offOnScreenOffer === 'function') offOnScreenOffer();
		if (typeof offStop === 'function') offStop();
	};
}

