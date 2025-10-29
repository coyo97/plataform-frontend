// controllers/publisherCam.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';
import { startPublisherMedia } from '../features/cameraMic';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		emitIce: (candidate: RTCIceCandidateInit, to: string) => void;            // <- to requerido
		emitOffer: (offer: RTCSessionDescriptionInit, to: string) => void;        // <- to requerido
		onRequestOffer: (cb: (p: { viewerSocketId: string }) => void) => unknown;  // puede devolver off()
	};
	storeRef: React.MutableRefObject<{
		publisher?: RTCPeerConnection;                      // opcional (no broadcast)
		perViewer: Record<string, RTCPeerConnection>;
	}>;
	localStreamRef: React.MutableRefObject<MediaStream | null>;
	lastOfferPcRef: React.MutableRefObject<RTCPeerConnection | null>;           // ya no se usa para broadcast
};

export function setupPublisherCam(ctx: Ctx) {
	const { isStreamer, signaling, storeRef, localStreamRef } = ctx;

	if (!isStreamer) return () => {};

	// 1) Obtener y mostrar medios locales (sin crear PC de broadcast)
	startPublisherMedia()
	.then((stream) => {
		localStreamRef.current = stream;
		attachStreamToVideo('localVideo', stream);
		console.log('[[HOST]] local media ready: a=%d v=%d',
					stream.getAudioTracks().length, stream.getVideoTracks().length);
	})
	.catch((e) => console.error('[[HOST]] startPublisherMedia error', e));

	// 2) Para cada viewer que entra, crear UN PC dirigido y enviar offer con `to`
	const offReq = signaling.onRequestOffer(({ viewerSocketId }) => {
		console.log('[[HOST]] onRequestOffer → viewer=%s', viewerSocketId);

		let pc = storeRef.current.perViewer?.[viewerSocketId];
		if (!pc || pc.signalingState === 'closed' || pc.connectionState === 'failed') {
			pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitIce(e.candidate, viewerSocketId),
				onTrack: (ev) => {
					// (opcional) audio del viewer hacia el host
					const [stream] = ev.streams;
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
					if (el.srcObject !== stream) el.srcObject = stream;
				},
			});
			storeRef.current.perViewer = storeRef.current.perViewer || {};
			storeRef.current.perViewer[viewerSocketId] = pc;

			pc.onconnectionstatechange = () => {
				const st = pc!.connectionState;
				if (st === 'failed' || st === 'disconnected' || st === 'closed') {
					try { pc!.close(); } catch {}
					delete storeRef.current.perViewer[viewerSocketId];
				}
			};
		} else {
			console.log('[[HOST]] reusing perViewer PC for %s (signaling=%s)', viewerSocketId, pc.signalingState);
		}

		const ls = localStreamRef.current;
		if (!ls) {
			console.warn('[[HOST]] localStreamRef vacío; no puedo adjuntar tracks a viewer=%s', viewerSocketId);
			return;
		}

		// Evitar duplicar senders
		const need = { audio: true, video: true };
		pc.getSenders().forEach((s) => {
			if (s.track?.kind === 'audio') need.audio = false;
			if (s.track?.kind === 'video') need.video = false;
		});

		if (need.audio) {
			const at = ls.getAudioTracks()[0];
			if (at) {
				pc.addTrack(at, ls);
				console.log('[[HOST]] addTrack AUDIO → %s id=%s', viewerSocketId, at.id);
			}
		}
		if (need.video) {
			const vt = ls.getVideoTracks()[0];
			if (vt) {
				pc.addTrack(vt, ls);
				console.log('[[HOST]] addTrack VIDEO → %s id=%s', viewerSocketId, vt.id);
			}
		}

		(async () => {
			const offer = await pc!.createOffer();
			await pc!.setLocalDescription(offer);
			console.log('[[HOST-SIG]] emitOffer to=%s type=%s', viewerSocketId, offer.type);
			signaling.emitOffer(offer, viewerSocketId);
		})().catch((e) => console.error('[[HOST]] createOffer error → to=%s', viewerSocketId, e));
	});

	return () => {
		try { (offReq as any)?.(); } catch {}
	};
}

