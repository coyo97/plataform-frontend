import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';
import { startPublisherMedia } from '../features/cameraMic';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		emitIce: (candidate: RTCIceCandidateInit, to?: string) => void;
		emitOffer: (offer: RTCSessionDescriptionInit, to?: string) => void;
		onRequestOffer: (cb: (p: { viewerSocketId: string }) => void) => unknown; // <- puede devolver socket/void
	};
	storeRef: React.MutableRefObject<any>;
	localStreamRef: React.MutableRefObject<MediaStream | null>;
	lastOfferPcRef: React.MutableRefObject<RTCPeerConnection | null>;
};

export function setupPublisherCam(ctx: Ctx) {
	const { isStreamer, signaling, storeRef, localStreamRef, lastOfferPcRef } = ctx;

	if (isStreamer) {
		// media local y broadcast inicial
		startPublisherMedia()
		.then((stream) => {
			localStreamRef.current = stream;
			attachStreamToVideo('localVideo', stream);

			const pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitIce(e.candidate),
			});
			storeRef.current.publisher = pc;

			stream.getTracks().forEach((t) => {
				pc.addTrack(t, stream);
				console.log('[[CLT-PC]] publisher addTrack kind=%s id=%s', t.kind, t.id);
			});

			// Fallback BROADCAST (cam/mic)
			pc.createOffer().then((offer: RTCSessionDescriptionInit) => {
				pc.setLocalDescription(offer);
				lastOfferPcRef.current = pc;
				console.log('[[CLT-SIG]] emitOffer BROADCAST (cam/mic) sdpType=%s', offer.type);
				signaling.emitOffer(offer);
			});
		})
		.catch(console.error);

		// Ofertas dirigidas (onRequestOffer)
		const offReqMaybe = signaling.onRequestOffer(({ viewerSocketId }: { viewerSocketId: string }) => {
			console.log('[[CLT]] onRequestOffer viewer=%s', viewerSocketId);

			let pcDir: RTCPeerConnection | undefined = storeRef.current.perViewer[viewerSocketId];
			if (!pcDir || pcDir.signalingState === 'closed') {
				pcDir = createPeerConnection({
					iceServers: STUN_SERVERS,
					onIce: (e) => e.candidate && signaling.emitIce(e.candidate, viewerSocketId),
					onTrack: (ev) => {
						// Audio del viewer hacia streamer (si aplica)
						const id = `aud-${viewerSocketId}`;
						let el = document.getElementById(id) as HTMLAudioElement | null;
						if (!el) {
							el = document.createElement('audio');
							el.id = id;
							el.autoplay = true;
							el.controls = true;
							el.muted = false;
							document.body.appendChild(el);
						}
						if (el.srcObject !== ev.streams[0]) el.srcObject = ev.streams[0];
					},
				});
				storeRef.current.perViewer[viewerSocketId] = pcDir;
			} else {
				console.log('[[CLT]] reusing perViewer PC for %s (signaling=%s)', viewerSocketId, pcDir.signalingState);
			}

			const ls = localStreamRef.current;
			const need = { audio: true as boolean, video: true as boolean };

			pcDir.getSenders().forEach((s: RTCRtpSender) => {
				if (s.track?.kind === 'audio') need.audio = false;
				if (s.track?.kind === 'video') need.video = false;
			});

			if (!ls) {
				console.warn('[[CLT-PC]] no localStreamRef al preparar oferta cam/mic -> viewer=%s', viewerSocketId);
			} else {
				if (need.audio) {
					const at = ls.getAudioTracks()[0];
					if (at) {
						pcDir.addTrack(at, ls);
						console.log('[[CLT-PC]] addTrack AUDIO -> %s id=%s', viewerSocketId, at.id);
					}
				}
				if (need.video) {
					const vt = ls.getVideoTracks()[0];
					if (vt) {
						pcDir.addTrack(vt, ls);
						console.log('[[CLT-PC]] addTrack VIDEO -> %s id=%s', viewerSocketId, vt.id);
					}
				}
			}

			pcDir.createOffer().then(async (off: RTCSessionDescriptionInit) => {
				await pcDir!.setLocalDescription(off);
				console.log('[[CLT-SIG]] emitOffer DIRECTA (cam/mic) to=%s sdpType=%s', viewerSocketId, off.type);
				signaling.emitOffer(off, viewerSocketId);
			});
		});

		return () => {
			if (typeof offReqMaybe === 'function') offReqMaybe(); // si tu signaling no devuelve función, no pasa nada
		};
	}

	return () => {};
}

