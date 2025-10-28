// src/ui/features/stream/hooks/useStreamConnection/controllers/screenFromViewer.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		emitScreenIce: (cand: RTCIceCandidateInit, to: string) => void;
		emitScreenAnswer: (ans: RTCSessionDescriptionInit, to: string) => void;
	};
	storeRef: React.MutableRefObject<any>;
	targetVideoId?: string; // id del <video> donde quieres mostrar la pantalla del viewer (p.ej. 'viewerScreen')
};

export function setupScreenFromViewer(ctx: Ctx) {
	const { isStreamer, signaling, storeRef, targetVideoId = 'screenVideo' } = ctx;

	if (!isStreamer) return () => {};

	const onMaybe = signaling.onScreenOffer(async ({ offer, from }) => {
		let pc: RTCPeerConnection | undefined = storeRef.current.perViewerScreen?.[from];
		if (!pc || pc.signalingState === 'closed') {
			pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, from),
				onTrack: (ev) => {
					const [ms] = ev.streams;
					attachStreamToVideo(targetVideoId, ms);
					const el = document.getElementById(targetVideoId) as HTMLVideoElement | null;
					if (el) {
						el.style.display = 'block';
						el.muted = false;
						el.play?.().catch(() => {});
					}
				},
			});
			if (!storeRef.current.perViewerScreen) storeRef.current.perViewerScreen = {};
			storeRef.current.perViewerScreen[from] = pc;
		}

		await pc.setRemoteDescription(new RTCSessionDescription(offer));
		const ans = await pc.createAnswer();
		await pc.setLocalDescription(ans);
		signaling.emitScreenAnswer(ans, from);
	});

	return () => {
		if (typeof onMaybe === 'function') onMaybe();
	};
}

