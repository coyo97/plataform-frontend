// src/ui/features/stream/hooks/useStreamConnection/useStreamConnection.ts
import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../../../shared/hooks/useSocket';
import { EVENTS } from '../../../../../utils/socket/events';
import { Viewer, UseStreamConnectionProps } from './types';

import { useBuildContext } from './deps';
// controladores
import { setupPublisherCam } from './controllers/publisherCam';
import { setupPerViewerCam } from './controllers/perViewerCam';
import { setupAnswersHandlers } from './controllers/answersHandlers';
import { setupIceHandlers } from './controllers/iceHandlers';
import { setupScreenSender } from './controllers/screenSender';
import { setupScreenViewer } from './controllers/screenViewer';
import { setupScreenFromViewer } from './controllers/screenFromViewer';

export const useStreamConnection = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
}: UseStreamConnectionProps) => {
	const [viewers, setViewers] = useState<Viewer[]>([]);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isCamOn, setCamOn] = useState(true);
	const [isMicOn, setMicOn] = useState(true);

	const sock = useSocket();

	const {
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

		// Viewer actions
		viewerStartCam,
		viewerStopCam,
		viewerStartScreenShare,
		viewerStopScreenShare,

		// extras
		viewerOutScreenPcRef,
		ownerSocketIdRef,
	} = useBuildContext({
		streamId,
		isStreamer,
		accessCode,
		onStreamEnd,
		sock,
		setIsScreenSharing,
		setCamOn,
		setMicOn,
	});

	// ==== ROLE tagging para logs del signaling (si existe) ====
	try {
		(signaling as any)?.setRole?.(isStreamer ? 'owner' : 'viewer');
	} catch {}

	// ==== RELAY: PCs por (origin -> receiver) ====
	const relayPCsByReceiverRef = useRef<Record<string, RTCPeerConnection>>({});
	const relayPCsByOriginRef = useRef<Record<string, Record<string, RTCPeerConnection>>>({});

	// Para detectar "nuevos viewers"
	const knownViewersRef = useRef<Set<string>>(new Set());

	// Tipado estrecho del signaling, ahora **exige `to`** en offer/ice:
	const sig = signaling as unknown as {
		emitIce: (c: RTCIceCandidateInit, to: string) => void;         // requerido
		emitOffer: (o: RTCSessionDescriptionInit, to: string) => void; // requerido
		onRequestOffer: (cb: (p: { viewerSocketId: string }) => void) => unknown;
		emitAnswer: (a: RTCSessionDescriptionInit, to: string) => void;  // <- AÑADIR ESTA LÍNEA
		onOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		onAnswer: (cb: (p: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;

		onIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;

		// pantalla
		onRequestScreenShare: (cb: (p: { viewerSocketId: string }) => void) => unknown;
		onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		onScreenAnswer: (cb: (p: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		onScreenIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
		emitScreenIce: (c: RTCIceCandidateInit, to: string) => void;
		emitScreenAnswer: (a: RTCSessionDescriptionInit, to: string) => void;
		emitScreenOffer: (o: RTCSessionDescriptionInit, to: string) => void;

		// estado / varios
		onCurrentStreamState?: (cb: (p: {
			isSharingScreen?: boolean;
			isStreamerMuted?: boolean;
			viewersCount?: number;
			hasCamera?: boolean;
			hasMic?: boolean;
		}) => void) => unknown;

		onUpdateViewers: (cb: (p: { viewers: Viewer[] }) => void) => unknown;
		onStreamEnded: (cb: () => void) => unknown;
		onKicked: (cb: () => void) => unknown;
		onStreamError: (cb: (p: { message: string }) => void) => unknown;

		// acciones directas
		joinStream: (accessCode?: string) => unknown;
		leaveStream: () => unknown;
		requestScreenShare: () => void;
		onStreamOwner?: (cb: (d: { ownerSocketId?: string }) => void) => unknown;
		offAll: () => unknown;
	};

	const kicked = useRef(false);

	useEffect(() => {
		console.log('[[CLT]] joinStream streamId=%s isStreamer=%s', streamId, isStreamer);
		sig.joinStream(accessCode);

		// Snapshot estado
		const offSnapshot = sig.onCurrentStreamState?.(
			({ isSharingScreen, isStreamerMuted, viewersCount, hasCamera, hasMic }) => {
				if (typeof isSharingScreen === 'boolean') setIsScreenSharing(isSharingScreen);
				if (typeof hasCamera === 'boolean') setCamOn(hasCamera);
				if (typeof hasMic === 'boolean') setMicOn(hasMic);
				console.log(
					'[[STATE]] snapshot -> screen=%s cam=%s mic=%s viewers=%s muted=%s',
					isSharingScreen, hasCamera, hasMic, viewersCount, isStreamerMuted
				);
			}
		);

		// Guardar ownerSocketId para flows directos (útil para depurar rutas)
		const offOwner = sig.onStreamOwner?.(({ ownerSocketId }) => {
			ownerSocketIdRef.current = ownerSocketId;
			if (isStreamer) {
				console.log('[[OWNER]] stream-owner set ownerSocketId=%s (yo soy owner)', ownerSocketId);
			} else {
				console.log('[[VIEWER]] stream-owner recibido ownerSocketId=%s', ownerSocketId);
			}
		});

		// Helper: RELAY per viewer
		const relayViewerScreen = async (from: string, to: string) => {
			if (!isStreamer) return;
			if (to === from) return;

			const ms = storeRef.current.viewerScreens?.[from] as MediaStream | undefined;
			if (!ms) {
				console.log('[[RELAY]] no existe viewerScreens[%s] aún, skip → to=%s', from, to);
				return;
			}

			if (!relayPCsByOriginRef.current[from]) relayPCsByOriginRef.current[from] = {};
			if (relayPCsByOriginRef.current[from][to]) {
				const pc0 = relayPCsByOriginRef.current[from][to];
				if (pc0.connectionState !== 'failed' && pc0.signalingState !== 'closed') {
					console.log('[[RELAY]] ya existe pc (from=%s → to=%s), skip', from, to);
					return;
				}
			}

			console.log('[[RELAY]] crear pc (from=%s → to=%s)', from, to);
			const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
			relayPCsByOriginRef.current[from][to] = pc;
			relayPCsByReceiverRef.current[to] = pc;

			pc.onicecandidate = (e) => {
				if (e.candidate) sig.emitScreenIce(e.candidate, to);
			};

			pc.onconnectionstatechange = () => {
				const st = pc.connectionState;
				if (st === 'failed' || st === 'closed' || st === 'disconnected') {
					console.log('[[RELAY]] pc state=%s → close (from=%s → to=%s)', st, from, to);
					try { pc.close(); } catch {}
					delete relayPCsByOriginRef.current[from]?.[to];
					delete relayPCsByReceiverRef.current[to];
				}
			};

			const vtrack = ms.getVideoTracks()[0];
			if (!vtrack) {
				console.warn('[[RELAY]] viewerScreens[%s] sin video track', from);
				return;
			}
			const cloned = vtrack.clone();
			const relayStream = new MediaStream([cloned]);
			pc.addTrack(cloned, relayStream);

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			sig.emitScreenOffer(offer, to);
			console.log('[[RELAY]] emit screen-offer (from=%s → to=%s)', from, to);
		};

		// Controladores base (cámara/mic por-viewer):
		const publisherCleanup = setupPublisherCam({
			isStreamer,
			signaling: sig,
			storeRef,
			localStreamRef,
			lastOfferPcRef,
		});

		const perViewerCleanup = setupPerViewerCam({
			isStreamer,
			signaling: sig,
			storeRef,
			viewerMicRef,
		});

		const answersCleanup = setupAnswersHandlers({
			isStreamer,
			signaling: sig,
			storeRef,
			lastOfferPcRef,
			screenPCsRef,
			pendingScreenCandidatesRef,
			safeAddIce,
			viewerOutScreenPcRef, // opcional
			ownerSocketIdRef,
		});

		const iceCleanup = setupIceHandlers({
			isStreamer,
			signaling: sig,
			storeRef,
			screenPCsRef,
			pendingScreenCandidatesRef,
			safeAddIce,
			viewerOutScreenPcRef, // opcional
			ownerSocketIdRef,
		});

		const screenSenderCleanup = setupScreenSender({
			isStreamer,
			signaling: sig,
			screenPCsRef,
			pendingScreenCandidatesRef,
			sendDirectScreenOfferTo,
		});

		// Host recibe pantallas de viewers → re-publica a todos (relay SFU ligero)
		const screenRoleCleanup = isStreamer
			? setupScreenFromViewer({
				isStreamer: true,
				signaling: sig,
				storeRef,
				screenPCsRef,
				pendingScreenCandidatesRef,
				safeAddIce,
				// clave: pasamos nuestro helper como "relayViewerScreenOfferTo"
				relayViewerScreenOfferTo: relayViewerScreen,
			})
				: setupScreenViewer({
					isStreamer: false,
					signaling: sig,
					storeRef,
					clearRemoteScreen,
					screenPCsRef,
					pendingScreenCandidatesRef,
					safeAddIce,
				});

				// ==== RELAY HANDLERS (solo host necesita relays) ====
				let offScreenAnsRelay: any;
				let offScreenIceRelay: any;

				if (isStreamer) {
					// Responder ANSWER / ICE de los receptores del relay (clave = receiver socketId)
					offScreenAnsRelay = sig.onScreenAnswer(({ from, answer }) => {
						const pc = relayPCsByReceiverRef.current[from];
						if (pc && pc.signalingState !== 'closed') {
							pc.setRemoteDescription(answer).catch((e) =>
																  console.warn('[[RELAY]] setRemoteDescription(answer) fallo receiver=%s', from, e)
																 );
						} else {
							console.log('[[RELAY]] onScreenAnswer receiver=%s sin PC activo', from);
						}
					});

					offScreenIceRelay = sig.onScreenIce(({ from, candidate }) => {
						const pc = relayPCsByReceiverRef.current[from];
						if (pc && pc.signalingState !== 'closed') {
							safeAddIce(pc, candidate).catch((e) =>
															console.warn('[[RELAY]] addIceCandidate fallo receiver=%s', from, e)
														   );
						} else {
							console.log('[[RELAY]] onScreenIce receiver=%s sin PC activo', from);
						}
					});
				}

				// ==== Lista de viewers (y relanzar pantallas a los nuevos) ====
				const offViewers = sig.onUpdateViewers(({ viewers }) => {
					console.log('[[CLT]] update-viewers size=%d', viewers?.length ?? 0);
					setViewers(viewers);

					if (!isStreamer) return;

					const getSid = (v: any) => v?.socketId ?? v?.socket?.id ?? v?.id ?? v?._id ?? '';
					const cur = new Set((viewers || []).map(getSid).filter(Boolean) as string[]);

					// detectar nuevos viewers y relanzar TODAS las pantallas conocidas
					cur.forEach((sid) => {
						if (!knownViewersRef.current.has(sid)) {
							console.log('[[OWNER]] nuevo viewer detectado=%s → relanzar pantallas existentes', sid);
							const origins = Object.keys(storeRef.current.viewerScreens || {});
							origins.forEach((from) => {
								if (from !== sid) relayViewerScreen(from, sid);
							});
						}
					});
					knownViewersRef.current = cur;
				});

				// ==== Al llegar una NUEVA pantalla desde "from", relanzar a todos ====
				const onScreenAdded = (ev: any) => {
					if (!isStreamer) return;
					const from: string | undefined = ev?.detail?.from;
					if (!from) return;
					const targets = Array.from(knownViewersRef.current);
					console.log('[[OWNER]] viewer-screen-added from=%s → relay a %d viewers', from, targets.length);
					targets.forEach((to) => {
						if (to !== from) relayViewerScreen(from, to);
					});
				};
				window.addEventListener('viewer-screen-added', onScreenAdded as any);

				// Ended / Kicked / Error
				const offEnded = sig.onStreamEnded(() => {
					console.log('[[CLT]] onStreamEnded → stopLocalMedia');
					stopLocalMedia();
					onStreamEnd?.();
				});
				const offKicked = sig.onKicked(() => {
					console.log('[[CLT]] onKicked → handleLeaveStream');
					kicked.current = true;
					handleLeaveStream();
				});
				const offError = sig.onStreamError(({ message }) => {
					console.error('[[CLT]] onStreamError:', message);
					if (message.toLowerCase().includes('expulsado')) {
						kicked.current = true;
						handleLeaveStream();
					}
				});

				// Viewer: al entrar/reconectar, pedir pantalla si el owner ya estaba compartiendo
				const onReconnect = () => {
					if (!isStreamer) {
						console.log('[[VIEWER]] reconnect → requestScreenShare()');
						sig.requestScreenShare();
					}
				};
				if (!isStreamer) {
					sig.requestScreenShare();
					sock.on('connect', onReconnect);
				}

				return () => {
					console.log('[[CLT]] cleanup useStreamConnection');

					// Off básicos
					try { offSnapshot && (offSnapshot as any)(); } catch {}
					try { offOwner && (offOwner as any)(); } catch {}
					try { offViewers && (offViewers as any)(); } catch {}
					try { offEnded && (offEnded as any)(); } catch {}
					try { offKicked && (offKicked as any)(); } catch {}
					try { offError && (offError as any)(); } catch {}

					// Off relays
					window.removeEventListener('viewer-screen-added', onScreenAdded as any);
					try { offScreenAnsRelay && (offScreenAnsRelay as any)(); } catch {}
					try { offScreenIceRelay && (offScreenIceRelay as any)(); } catch {}

					// Salir / apagar signaling
					try { sig.leaveStream(); } catch {}
					try { sig.offAll(); } catch {}

					// apagar medios
					stopLocalMedia();
					try { localStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
					try { viewerMicRef.current?.getTracks().forEach(t => t.stop()); } catch {}

					// cerrar PCs base
					try { storeRef.current.publisher?.close(); } catch {}
					storeRef.current.publisher = undefined;
					try { storeRef.current.screenPublisher?.close(); } catch {}
					storeRef.current.screenPublisher = undefined;

					Object.values(storeRef.current.perViewer || {}).forEach((pc: RTCPeerConnection) => {
						try { pc.close(); } catch {}
					});
					storeRef.current.perViewer = {};

					Object.values(storeRef.current.perStreamer || {}).forEach((pc: RTCPeerConnection) => {
						try { pc.close(); } catch {}
					});
					storeRef.current.perStreamer = {};

					// cerrar PCs de pantalla por viewer (host->viewer directo)
					Object.values(screenPCsRef.current || {}).forEach((pc: RTCPeerConnection) => {
						try { pc.close(); } catch {}
					});
					screenPCsRef.current = {};
					pendingScreenCandidatesRef.current = {};

					// cerrar PCs de RELAY
					Object.values(relayPCsByReceiverRef.current).forEach((pc) => { try { pc.close(); } catch {} });
					relayPCsByReceiverRef.current = {};
					Object.values(relayPCsByOriginRef.current).forEach((m) => {
						Object.values(m).forEach((pc) => { try { pc.close(); } catch {} });
					});
					relayPCsByOriginRef.current = {};

					// unbind de controladores
					try { (publisherCleanup as any)(); } catch {}
					try { (perViewerCleanup as any)(); } catch {}
					try { (answersCleanup as any)(); } catch {}
					try { (iceCleanup as any)(); } catch {}
					try { (screenSenderCleanup as any)(); } catch {}
					try { (screenRoleCleanup as any)(); } catch {}

					sock.off('connect', onReconnect);
				};
				// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sig, isStreamer, streamId]);

	return {
		viewers,
		isScreenSharing,
		isCamOn,
		isMicOn,

		startScreenShare,
		stopScreenShare,
		startRecording,
		stopRecording,
		toggleCamera,
		toggleMic,

		// Viewer actions
		viewerStartCam,
		viewerStopCam,
		viewerStartScreenShare,
		viewerStopScreenShare,

		kickViewer: (id: string) => sock.emit(EVENTS.KICK_VIEWER, { streamId, viewerId: id }),
		handleLeaveStream,
		wasKicked: kicked.current,
	};
};

