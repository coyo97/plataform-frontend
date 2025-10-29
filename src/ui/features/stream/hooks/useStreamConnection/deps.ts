// useBuildContext.ts (antes buildContext.ts)
import { useMemo, useRef } from 'react';
import { STUN_SERVERS } from './constants';
import { createSignalingClient } from './signaling/signalingClient';
import { createPeerConnection } from './webrtc/peerFactory';
import { createPeerStore } from './webrtc/peerStore';
import { attachStreamToVideo, attachLocalPreview, clearVideoEl } from './webrtc/mediaAttach';
import { stopTracks } from './features/cameraMic'; // <- dejé solo lo que usas aquí
import { createMediaControls } from './mediaControls';
import { createScreenShare } from './screenShare';
import { createRecorder } from './recording';
import { createLeaveHandlers } from './leaveStream';
import { safeAddIce as _safeAddIce } from './utils/ice';

type UseBuildCtxParams = {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd?: () => void;
	sock: any; // si tienes tu tipo SocketLike, úsalo aquí
	setIsScreenSharing: (v: boolean) => void;
	setCamOn: (v: boolean) => void;
	setMicOn: (v: boolean) => void;
};


export function useBuildContext({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
	sock,
	setIsScreenSharing,
	setCamOn,
	setMicOn,
}: UseBuildCtxParams) {
	const signaling = useMemo(() => createSignalingClient(sock, streamId), [sock, streamId]);

	const storeRef = useRef(createPeerStore());
	const localStreamRef = useRef<MediaStream | null>(null);
	const viewerMicRef = useRef<MediaStream | null>(null);
	const lastOfferPcRef = useRef<RTCPeerConnection | null>(null);

	// PCs dedicados para pantalla (por viewer) y candidatos pendientes
	const screenPCsRef = useRef<Record<string, RTCPeerConnection>>({});
	const pendingScreenCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});

	const screenRelayPCsRef = useRef<Record<string, Record<string, RTCPeerConnection>>>({});

	// NEW: refs para que el VIEWER pueda emitir hacia el streamer
	const ownerSocketIdRef = useRef<string | undefined>(undefined);
	const viewerOutCamPcRef = useRef<RTCPeerConnection | undefined>(undefined);
	const viewerOutScreenPcRef = useRef<RTCPeerConnection | undefined>(undefined);

	const viewerLocalCamRef = useRef<MediaStream | null>(null);
	const viewerLocalScreenRef = useRef<MediaStream | null>(null);

	// recibir el owner actual (y mantenerlo fresco)
	signaling.onStreamOwner?.(({ ownerSocketId }) => {
		ownerSocketIdRef.current = ownerSocketId;
		console.log('[SIG] stream-owner => ownerSocketId=', ownerSocketIdRef.current);
	});

	// Esperar a que llegue el ownerSocketId (con reintentos cortos)
	async function waitForOwnerSocketId(opts = { tries: 6, delayMs: 250 }): Promise<string | undefined> {
		for (let i = 0; i < opts.tries; i++) {
			const cur = ownerSocketIdRef.current;
			if (cur) {
				console.log('[OWNER] listo ownerSocketId=', cur);
				return cur;
			}
			console.log(`[OWNER] aún no llega (try ${i + 1}/${opts.tries}) → solicitar al backend`);
			signaling.requestScreenShare();
			await new Promise((r) => setTimeout(r, opts.delayMs));
		}
		console.warn('[OWNER] no llegó ownerSocketId tras reintentos');
		return ownerSocketIdRef.current ?? undefined;
	}

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
		const sender = scrPC.getSenders().find((s) => s.track && s.track.kind === 'video');
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
				const hasVideoSender = pc.getSenders().some((s) => s.track?.kind === 'video');
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

	async function relayViewerScreenOfferTo(screenOwnerSocketId: string, targetViewerSocketId: string) {
		try {
			const ms: MediaStream | undefined = storeRef.current.viewerScreens?.[screenOwnerSocketId];
			const baseTrack = ms?.getVideoTracks?.()[0];
			if (!ms || !baseTrack) {
				console.warn('[[RELAY]] no hay screen del viewer=%s para enviar a viewer=%s', screenOwnerSocketId, targetViewerSocketId);
				return;
			}

			if (!screenRelayPCsRef.current[screenOwnerSocketId]) {
				screenRelayPCsRef.current[screenOwnerSocketId] = {};
			}
			let pc = screenRelayPCsRef.current[screenOwnerSocketId][targetViewerSocketId];

			if (!pc || pc.signalingState === 'closed') {
				pc = createPeerConnection({
					iceServers: STUN_SERVERS,
					onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, targetViewerSocketId),
					onTrack: () => { /* relay solo envía */ },
				});
				screenRelayPCsRef.current[screenOwnerSocketId][targetViewerSocketId] = pc;

				const cloned = baseTrack.clone();
				const out = new MediaStream([cloned]);
				pc.addTrack(cloned, out);
				console.log('[[RELAY]] addTrack clone from=%s -> to=%s trackId=%s', screenOwnerSocketId, targetViewerSocketId, cloned.id);
			}

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			console.log('[[RELAY-SIG]] emitScreenOffer (relay) owner=%s -> to=%s type=%s', screenOwnerSocketId, targetViewerSocketId, offer.type);
			signaling.emitScreenOffer(offer, targetViewerSocketId);
		} catch (err) {
			console.error('[[RELAY]] error relayViewerScreenOfferTo', err);
		}
	}

	const safeAddIce = _safeAddIce;

	// ======== Acciones del VIEWER ========

	async function viewerStartCam(): Promise<MediaStream> {
		const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		viewerLocalCamRef.current = ms;

		// Preview local (miniatura) del viewer
		attachLocalPreview('viewerSelfCam', ms, { muted: true });

		const pc = createPeerConnection({
			iceServers: STUN_SERVERS,
			onIce: (e) => {
				if (!e.candidate) return;
				if (ownerSocketIdRef.current) {
					signaling.emitIce(e.candidate, ownerSocketIdRef.current);
				} else {
					signaling.emitIce(e.candidate); // fallback si tu backend lo tolera
				}
			},
		});
		viewerOutCamPcRef.current = pc;

		// marcar último PC ofertante si algunos handlers lo leen
		lastOfferPcRef.current = pc;

		ms.getTracks().forEach((t) => pc.addTrack(t, ms));

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		if (ownerSocketIdRef.current) {
			signaling.emitOffer(offer, ownerSocketIdRef.current);
		} else {
			signaling.emitOffer(offer); // fallback
		}

		// Si el usuario apaga cámara desde el SO/sistema, limpia preview
		ms.getVideoTracks().forEach((t) => {
			t.onended = () => {
				clearVideoEl('viewerSelfCam');
			};
		});

		return ms;
	}

	function viewerStopCam() {
		try { viewerOutCamPcRef.current?.close(); } catch {}
		viewerOutCamPcRef.current = undefined;
		clearVideoEl('viewerSelfCam');
		stopTracks(viewerLocalCamRef.current);
		viewerLocalCamRef.current = null;
	}

	async function viewerStartScreenShare(): Promise<MediaStream> {
		let target: string | undefined = ownerSocketIdRef.current;
		if (!target) {
			console.log('[SCRN][VIEWER] ownerSocketId no disponible → esperar…');
			const waited = await waitForOwnerSocketId({ tries: 6, delayMs: 250 });
			if (!waited) {
				console.error('[SCRN][VIEWER] abort: no hay ownerSocketId (no se puede poner "to")');
				throw new Error('No ownerSocketId yet');
			}
			target = waited;
		}

		const display: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: false });
		viewerLocalScreenRef.current = display;

		// Preview local de pantalla (miniatura)
		attachLocalPreview('viewerSelfScreen', display, { muted: true });

		const seenOutgoingIce = new Set<string>();
		const key = (c: RTCIceCandidateInit) => `${c.sdpMid ?? ''}|${c.sdpMLineIndex ?? ''}|${c.candidate ?? ''}`;

		const pc = createPeerConnection({
			iceServers: STUN_SERVERS,
			onIce: (e) => {
				if (!e.candidate) return;
				const k = key(e.candidate);
				if (seenOutgoingIce.has(k)) return;
				seenOutgoingIce.add(k);
				console.log('[SCRN][VIEWER] emit screen-ice → to=', target);
				signaling.emitScreenIce(e.candidate, target!);
			},
		});
		viewerOutScreenPcRef.current = pc;

		// Mapea YA el PC por ownerId para que ICE handler lo encuentre de inmediato
		screenPCsRef.current[target] = pc;
		console.log('[SCRN][VIEWER] map screenPCsRef[%s] = viewerOutScreenPc', target);
		lastOfferPcRef.current = pc;

		const track = display.getVideoTracks()[0];
		pc.addTrack(track, display);
		console.log('[SCRN][VIEWER] addTrack screen kind=video id=', track?.id);

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		// importa: screen-offer SIEMPRE dirigido
		console.log('[SIG->] screen-share-offer → to=', target);
		signaling.emitScreenOffer(offer, target);

		// Si el usuario corta la compartición desde el sistema
		track.onended = () => viewerStopScreenShare();

		return display;
	}

	function viewerStopScreenShare() {
		try { viewerOutScreenPcRef.current?.close(); } catch {}
		viewerOutScreenPcRef.current = undefined;
		clearVideoEl('viewerSelfScreen');
		stopTracks(viewerLocalScreenRef.current);
		viewerLocalScreenRef.current = null;

		// Limpia mapping y pendientes asociados al owner
		const curOwner = ownerSocketIdRef.current;
		if (curOwner) {
			if (screenPCsRef.current[curOwner]) {
				try { screenPCsRef.current[curOwner].close(); } catch {}
				delete screenPCsRef.current[curOwner];
			}
			if (pendingScreenCandidatesRef.current[curOwner]?.length) {
				console.log('[SCRN][VIEWER] limpiando ICE pendientes del owner=%s (%d)',
							curOwner, pendingScreenCandidatesRef.current[curOwner].length);
							delete pendingScreenCandidatesRef.current[curOwner];
			}
		}

		// notifica fin de pantalla (si tu backend lo usa)
		sock.emit?.('stop-screen-share', { streamId });
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
		relayViewerScreenOfferTo,
		clearRemoteScreen,
		safeAddIce,

		// Acciones del viewer
		viewerStartCam,
		viewerStopCam,
		viewerStartScreenShare,
		viewerStopScreenShare,

		// refs expuestas para otros controladores
		ownerSocketIdRef,
		viewerOutScreenPcRef,
	};
}

