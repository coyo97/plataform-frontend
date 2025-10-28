import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';
import { startViewerMic } from '../features/cameraMic';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		onOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown; // <- puede devolver socket/void
		emitIce: (candidate: RTCIceCandidateInit, to: string) => void;
		emitAnswer?: (answer: RTCSessionDescriptionInit, to: string) => void;
	};
	storeRef: React.MutableRefObject<any>;
	viewerMicRef: React.MutableRefObject<MediaStream | null>;
};

export function setupPerViewerCam(ctx: Ctx) {
	const { isStreamer, signaling, storeRef, viewerMicRef } = ctx;

	if (!isStreamer) {
		// mic del viewer
		startViewerMic()
		.then((ms) => {
			viewerMicRef.current = ms;
			console.log('[[VIEWER]] mic ready tracks=%d', ms.getAudioTracks().length);
		})
		.catch((e) => console.error('[[VIEWER]] mic error', e));

		// recibir oferta de cam/mic del streamer
		const offMaybe = signaling.onOffer(async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
			console.log('[[VIEWER]] onOffer from=%s type=%s', from, offer?.type);

			const pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitIce(e.candidate, from),
				onTrack: (ev) => {
					const [remote] = ev.streams;
					console.log(
						'[[VIEWER]] ontrack kind=%s a=%d v=%d',
						ev.track.kind,
						remote.getAudioTracks().length,
						remote.getVideoTracks().length
					);

					attachStreamToVideo('remoteVideo', remote);
					const videoEl = document.getElementById('remoteVideo') as HTMLVideoElement | null;
					if (videoEl) {
						videoEl.style.display = 'block';
						videoEl.muted = false;
						const p = videoEl.play?.();
						if (p && typeof p.catch === 'function') {
							p.catch((err: unknown) => {
								console.warn('[[VIEWER]] video.play() blocked (autoplay?)', err);
							});
						}
					}
				},
			});

			storeRef.current.perStreamer[from] = pc;

			viewerMicRef.current?.getAudioTracks().forEach((t) => {
				pc.addTrack(t, viewerMicRef.current!);
				console.log('[[VIEWER]] addTrack mic to pc for from=%s id=%s', from, t.id);
			});

			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			const answer: RTCSessionDescriptionInit = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			console.log('[[VIEWER-SIG]] emitAnswer to=%s type=%s', from, answer.type);
			signaling.emitAnswer?.(answer, from);
		});

		return () => {
			if (typeof offMaybe === 'function') offMaybe();
		};
	}

	return () => {};
}

