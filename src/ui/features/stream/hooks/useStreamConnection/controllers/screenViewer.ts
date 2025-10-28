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

	if (isStreamer) return () => {};

	const onMaybe = signaling.onScreenOffer(async ({ offer, from }) => {
		console.log('[[VIEWER]] onScreenOffer from=%s type=%s', from, offer?.type);

		let pc = storeRef.current.screenPublisher ?? null;
		if (!pc || pc.signalingState === 'closed') {
			pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, from),
				onTrack: (ev) => {
					const [ms] = ev.streams;
					console.log('[[VIEWER]] screen ontrack a=%d v=%d', ms.getAudioTracks().length, ms.getVideoTracks().length);
					attachStreamToVideo('screenVideo', ms);
					const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
					if (el) {
						el.style.display = 'block';
						el.muted = false;
						const p = el.play?.();
						if (p && typeof p.catch === 'function') {
							p.catch((err: unknown) => console.warn('[[VIEWER]] screen video.play() blocked', err));
						}
					}
					ev.track.onended = () => clearRemoteScreen();
					ms.addEventListener('removetrack', () => {
						if (ms.getVideoTracks().length === 0) clearRemoteScreen();
					});
				},
			});
			storeRef.current.screenPublisher = pc;
		}

		if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
			try { pc.close(); } catch {}
			pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, from),
				onTrack: (ev) => {
					const [ms] = ev.streams;
					attachStreamToVideo('screenVideo', ms);
					const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
					if (el) {
						el.style.display = 'block';
						el.muted = false;
						const p = el.play?.();
						if (p && typeof p.catch === 'function') {
							p.catch((err: unknown) => console.warn('[[VIEWER]] screen video.play() blocked', err));
						}
					}
					ev.track.onended = () => clearRemoteScreen();
					ms.addEventListener('removetrack', () => {
						if (ms.getVideoTracks().length === 0) clearRemoteScreen();
					});
				},
			});
			storeRef.current.screenPublisher = pc;
		}

		await pc.setRemoteDescription(new RTCSessionDescription(offer));
		if (pc.signalingState === 'have-remote-offer') {
			const ans: RTCSessionDescriptionInit = await pc.createAnswer();
			await pc.setLocalDescription(ans);
			console.log('[[VIEWER-SIG]] emitScreenAnswer to=%s type=%s', from, ans.type);
			signaling.emitScreenAnswer(ans, from);
		}

		const pcLocal = pc;
		pcLocal.onconnectionstatechange = () => {
			const st = pcLocal.connectionState;
			console.log('[[VIEWER]] screen pc connectionState=%s', st);
			if (st === 'failed' || st === 'disconnected' || st === 'closed') {
				clearRemoteScreen();
			}
		};
	});

	let unbindStopMaybe: unknown;
	if (ctx.signaling.onStopScreenShare) {
		unbindStopMaybe = ctx.signaling.onStopScreenShare(() => {
			console.log('[[VIEWER]] stop-screen-share → clearRemoteScreen()');
			clearRemoteScreen();
		});
	}

	return () => {
		if (typeof onMaybe === 'function') onMaybe();
		if (typeof unbindStopMaybe === 'function') unbindStopMaybe();
	};
}

