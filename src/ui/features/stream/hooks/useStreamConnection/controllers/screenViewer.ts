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

	// Para coordinar con iceHandlers
	screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
	safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;
};

export function setupScreenViewer(ctx: Ctx) {
	const {
		isStreamer,
		signaling,
		storeRef,
		clearRemoteScreen,
		screenPCsRef,
		pendingScreenCandidatesRef,
		safeAddIce,
	} = ctx;

	// Este handler sólo aplica en VIEWER (recibe pantalla del owner)
	const slotName = 'screenPublisher';

	const offOffer = signaling.onScreenOffer(async ({ offer, from }) => {
		if (isStreamer) {
			// El host no atiende aquí (usa screenFromViewer.ts para pantallas de viewers)
			console.log('[[HOST]] onScreenOffer recibido en viewer-handler → skip');
			return;
		}

		console.log('[[VIEWER]] onScreenOffer from=%s type=%s', from, offer?.type);

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
					el.play?.().catch((err) => console.warn('[[VIEWER]] screen video.play() blocked', err));
				}
				ev.track.onended = () => clearRemoteScreen();
				ms.addEventListener('removetrack', () => {
					if (ms.getVideoTracks().length === 0) clearRemoteScreen();
				});
			},
		});

		// Asegurar PC válido
		let pc: RTCPeerConnection | undefined = storeRef.current[slotName];
		if (!pc || pc.signalingState === 'closed' || pc.connectionState === 'failed') {
			pc = makePc();
			storeRef.current[slotName] = pc;
		} else if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
			try { pc.close(); } catch {}
			pc = makePc();
			storeRef.current[slotName] = pc;
		}

		// Mapear por socketId del owner para que iceHandlers lo encuentre
		screenPCsRef.current[from] = pc!;

		// Aplicar offer y responder
		await pc!.setRemoteDescription(new RTCSessionDescription(offer));
		if (pc!.signalingState === 'have-remote-offer') {
			const ans = await pc!.createAnswer();
			await pc!.setLocalDescription(ans);
			console.log('[[VIEWER-SIG]] emitScreenAnswer to=%s type=%s', from, ans.type);
			signaling.emitScreenAnswer(ans, from);
		}

		// Drenar ICE pendientes
		const pend = pendingScreenCandidatesRef.current[from];
		if (pend?.length) {
			for (const c of pend) {
				try { await safeAddIce(pc!, c); } catch (e) {
					console.warn('[[VIEWER]] add ICE (pend) fail from=%s', from, e);
				}
			}
			pendingScreenCandidatesRef.current[from] = [];
		}

		pc!.onconnectionstatechange = () => {
			const st = pc!.connectionState;
			console.log('[[VIEWER]] screen pc connectionState=', st);
			if (st === 'failed' || st === 'disconnected' || st === 'closed') {
				clearRemoteScreen();
				if (screenPCsRef.current[from] === pc) delete screenPCsRef.current[from];
			}
		};
	});

	let offStop: unknown;
	if (signaling.onStopScreenShare) {
		offStop = signaling.onStopScreenShare(() => {
			clearRemoteScreen();
			Object.values(screenPCsRef.current).forEach((pc) => { try { pc.close(); } catch {} });
			screenPCsRef.current = {};
			pendingScreenCandidatesRef.current = {};
		});
	}

	return () => {
		try { (offOffer as any)?.(); } catch {}
		try { (offStop as any)?.(); } catch {}
	};
}

