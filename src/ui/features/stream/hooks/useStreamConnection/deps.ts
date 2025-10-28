import { useMemo, useRef } from 'react';
import { STUN_SERVERS } from './constants';
import { createSignalingClient } from './signaling/signalingClient';
import { createPeerConnection } from './webrtc/peerFactory';
import { createPeerStore } from './webrtc/peerStore';
import { attachStreamToVideo } from './webrtc/mediaAttach';
import { startPublisherMedia, startViewerMic, stopTracks } from './features/cameraMic';
import { createMediaControls } from './mediaControls';
import { createScreenShare } from './screenShare';
import { createRecorder } from './recording';
import { createLeaveHandlers } from './leaveStream';
import { safeAddIce as _safeAddIce } from './utils/ice';

type BuildCtxParams = {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd?: () => void;
	sock: any;
	setIsScreenSharing: (v: boolean) => void;
	setCamOn: (v: boolean) => void;
	setMicOn: (v: boolean) => void;
};

export function buildContext({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
	sock,
	setIsScreenSharing,
	setCamOn,
	setMicOn,
}: BuildCtxParams) {
	const signaling = useMemo(() => createSignalingClient(sock, streamId), [sock, streamId]);

	const storeRef = useRef(createPeerStore());
	const localStreamRef = useRef<MediaStream | null>(null);
	const viewerMicRef = useRef<MediaStream | null>(null);
	const lastOfferPcRef = useRef<RTCPeerConnection | null>(null);

	// PCs dedicados para pantalla (por viewer) y candidatos pendientes
	const screenPCsRef = useRef<Record<string, RTCPeerConnection>>({});
	const pendingScreenCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});

	// NEW: referencias para que el VIEWER pueda emitir hacia el streamer
	const ownerSocketIdRef = useRef<string | undefined>(undefined);
	const viewerOutCamPcRef = useRef<RTCPeerConnection | null>(null);
	const viewerOutScreenPcRef = useRef<RTCPeerConnection | null>(null);
	const viewerLocalCamRef = useRef<MediaStream | null>(null);
	const viewerLocalScreenRef = useRef<MediaStream | null>(null);

	// si el backend envía el owner (recomendado)
	sock.on?.('stream-owner', ({ ownerSocketId }: { ownerSocketId?: string }) => {
		ownerSocketIdRef.current = ownerSocketId;
	});

	const { startRecording, stopRecording } = createRecorder({ streamId, isStreamer });

	const { toggleCamera, toggleMic } = createMediaControls({
		streamId,
		isStreamer,
		sock,
		localStream: () => (isStreamer ? localStreamRef.current : viewerMicRef.current),
		setCamOn,
		setMicOn,
	});

	const { startScreenShare, stopScreenShare } = createScreenShare({
		streamId,
		sock,
		getScrPC: () => storeRef.current.screenPublisher ?? null,
		setScrPC: (pc) => (storeRef.current.screenPublisher = pc || undefined),
		setIsScreenSharing,
	});

	const { leaveStream: handleLeaveStream, stopLocalMedia } = createLeaveHandlers({
		streamId,
		socket: sock,
		onStreamEnd,
		localStreamRef,
		peerRef: { current: storeRef.current.publisher ?? null } as any,
		screenRef: { current: storeRef.current.screenPublisher ?? null } as any,
	});

	// Helpers =====

	const clearRemoteScreen = () => {
		try { storeRef.current.screenPublisher?.close(); } catch {}
		storeRef.current.screenPublisher = undefined;
		const v = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (v) {
			v.srcObject = null;
			v.removeAttribute('src');
			v.load();
			v.style.display = 'none';
		}
	};

	const getCurrentScreenTrack = (): MediaStreamTrack | null => {
		const scrPC = storeRef.current.screenPublisher;
		if (!scrPC) return null;
		const sender = scrPC.getSenders().find(s => s.track && s.track.kind === 'video');
		return sender?.track ?? null;
	};

	const sendDirectScreenOfferTo = async (viewerSocketId: string) => {
		try {
			let pc = screenPCsRef.current[viewerSocketId];

			if (!pc || pc.signalingState === 'closed') {
				pc = createPeerConnection({
					iceServers: STUN_SERVERS,
					onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, viewerSocketId),
					onTrack: (ev) => {
						console.log('[[STREAMER]] screenPC onTrack inesperado -> viewer=%s kind=%s', viewerSocketId, ev.track.kind);
					},
				});
				screenPCsRef.current[viewerSocketId] = pc;

				const track = getCurrentScreenTrack();
				if (!track) {
					console.warn('[[STREAMER]] no screenTrack disponible para viewer=%s', viewerSocketId);
					return;
				}
				const cloned = track.clone();
				const screenStream = new MediaStream([cloned]);
				pc.addTrack(cloned, screenStream);
				console.log('[[STREAMER]] screenPC addTrack (clone) -> viewer=%s trackId=%s', viewerSocketId, cloned.id);
			} else {
				const hasVideoSender = pc.getSenders().some(s => s.track?.kind === 'video');
				if (!hasVideoSender) {
					const track = getCurrentScreenTrack();
					if (!track) {
						console.warn('[[STREAMER]] no screenTrack al reusar PC -> viewer=%s', viewerSocketId);
						return;
					}
					const cloned = track.clone();
					const screenStream = new MediaStream([cloned]);
					pc.addTrack(cloned, screenStream);
					console.log('[[STREAMER]] screenPC addTrack (clone reattach) -> viewer=%s trackId=%s', viewerSocketId, cloned.id);
				}
			}

			const offer = await screenPCsRef.current[viewerSocketId].createOffer();
			await screenPCsRef.current[viewerSocketId].setLocalDescription(offer);
			console.log('[[STREAMER-SIG]] emitScreenOffer DIRECTA -> %s type=%s', viewerSocketId, offer.type);
			signaling.emitScreenOffer(offer, viewerSocketId);
		} catch (err) {
			console.error('[[STREAMER]] sendDirectScreenOfferTo error -> viewer=%s', viewerSocketId, err);
		}
	};

	const safeAddIce = _safeAddIce; // alias para inyectar en controladores

	// ======== NUEVO: Acciones del VIEWER ========

	/**
	 * El viewer enciende su cámara+mic y ofrece al streamer.
	 * Retorna el MediaStream local para que el UI lo pueda previsualizar si desea.
	 */
	async function viewerStartCam(): Promise<MediaStream> {
		// stream local del viewer
		const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		viewerLocalCamRef.current = ms;

		// PC de salida del viewer hacia el streamer
		const pc = createPeerConnection({
			iceServers: STUN_SERVERS,
			onIce: (e) => {
				if (!e.candidate) return;
				// dirigido si conocemos el owner; si no, broadcast (backend debe soportarlo)
				if (ownerSocketIdRef.current) {
					signaling.emitIce(e.candidate, ownerSocketIdRef.current);
				} else {
					signaling.emitIce(e.candidate); // broadcast a sala
				}
			},
		});
		viewerOutCamPcRef.current = pc;

		ms.getTracks().forEach(t => pc.addTrack(t, ms));

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		if (ownerSocketIdRef.current) {
			signaling.emitOffer(offer, ownerSocketIdRef.current);
		} else {
			signaling.emitOffer(offer); // broadcast
		}

		return ms;
	}

	function viewerStopCam() {
		try { viewerOutCamPcRef.current?.close(); } catch {}
		viewerOutCamPcRef.current = null;
		stopTracks(viewerLocalCamRef.current);
		viewerLocalCamRef.current = null;
	}

	/**
	 * El viewer comparte su pantalla hacia el streamer.
	 * Retorna el MediaStream de display para UI.
	 */
	async function viewerStartScreenShare(): Promise<MediaStream> {
		// @ts-ignore
		const display: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
		viewerLocalScreenRef.current = display;

		const pc = createPeerConnection({
			iceServers: STUN_SERVERS,
			onIce: (e) => {
				if (!e.candidate) return;
				if (ownerSocketIdRef.current) {
					signaling.emitScreenIce(e.candidate, ownerSocketIdRef.current);
				} else {
					// si tu signaling soporta broadcast para screen-ice, puedes exponer un método raw;
					// en nuestro caso usamos el API existente y dejamos sin "to".
					(signaling as any).emitScreenIce?.(e.candidate);
				}
			},
			onTrack: () => {
				// el viewer no necesita onTrack en su pc de salida;
			},
		});
		viewerOutScreenPcRef.current = pc;

		const track = display.getVideoTracks()[0];
		pc.addTrack(track, display);

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		if (ownerSocketIdRef.current) {
			signaling.emitScreenOffer(offer, ownerSocketIdRef.current);
		} else {
			signaling.emitScreenOffer(offer); // broadcast si el backend lo permite
		}

		// si el usuario corta desde el sistema operativo
		track.onended = () => viewerStopScreenShare();

		return display;
	}

	function viewerStopScreenShare() {
		try { viewerOutScreenPcRef.current?.close(); } catch {}
		viewerOutScreenPcRef.current = null;
		stopTracks(viewerLocalScreenRef.current);
		viewerLocalScreenRef.current = null;

		// notifica fin de pantalla (opcional)
		(signaling as any).emit?.('stop-screen-share', { streamId });
	}

	return {
		signaling,
		storeRef,
		localStreamRef,
		viewerMicRef,
		lastOfferPcRef,
		screenPCsRef,
		pendingScreenCandidatesRef,
		startRecording,
		stopRecording,
		toggleCamera,
		toggleMic,
		startScreenShare,
		stopScreenShare,
		handleLeaveStream,
		stopLocalMedia,
		sendDirectScreenOfferTo,
		clearRemoteScreen,
		safeAddIce,

		// NEW: acciones del viewer
		viewerStartCam,
		viewerStopCam,
		viewerStartScreenShare,
		viewerStopScreenShare,
	};
}

