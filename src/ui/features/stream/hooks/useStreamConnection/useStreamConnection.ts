import { useEffect, useMemo, useRef, useState } from 'react';
import { useSocket } from '../../../../shared/hooks/useSocket';
import { EVENTS } from '../../../../../utils/socket/events';
import { STUN_SERVERS } from './constants';
import { createMediaControls } from './mediaControls';
import { createScreenShare } from './screenShare';
import { createRecorder } from './recording';
import { createLeaveHandlers } from './leaveStream';
import { Viewer, UseStreamConnectionProps } from './types';

// NUEVO
import { createSignalingClient } from './signaling/signalingClient';
import { createPeerConnection } from './webrtc/peerFactory';
import { createPeerStore, closeAll } from './webrtc/peerStore';
import { attachStreamToVideo } from './webrtc/mediaAttach';
import { startPublisherMedia, startViewerMic, stopTracks } from './features/cameraMic';
import { safeAddIce } from './utils/ice';

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
	const signaling = useMemo(() => createSignalingClient(sock, streamId), [sock, streamId]);
	const storeRef = useRef(createPeerStore());
	const localStreamRef = useRef<MediaStream | null>(null);
	const viewerMicRef = useRef<MediaStream | null>(null);

	// Fallback de broadcast solo para cam/mic inicial
	const lastOfferPcRef = useRef<RTCPeerConnection | null>(null);

	// Cola por si piden pantalla antes de tener todo estable (si decides reutilizarla)
	const pendingViewers = useRef<string[]>([]);
	const kicked = useRef(false);

	// --- NUEVO: PCs de pantalla por viewer + candidatos pendientes por viewer
	const screenPCsRef = useRef<Record<string, RTCPeerConnection>>({});
	const pendingScreenCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});

	const { startRecording, stopRecording } = createRecorder({ streamId, isStreamer });

	const { toggleCamera, toggleMic } = createMediaControls({
		streamId,
		isStreamer,
		sock,
		localStream: () => (isStreamer ? localStreamRef.current : viewerMicRef.current),
		setCamOn,
		setMicOn,
	});

	// createScreenShare lo seguimos usando para iniciar/detener y exponer setIsScreenSharing.
	// OJO: ya NO usaremos su sendScreenOfferTo (broadcast) — ahora haremos ofertas dirigidas por viewer.
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

	// Helper: limpiar pantalla remota (viewer)
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

	// ======== Helpers NUEVOS (pantalla por viewer) ========

	// Track de pantalla actual del streamer (origen), tomada del "screenPublisher" global (solo como FUENTE)
	const getCurrentScreenTrack = (): MediaStreamTrack | null => {
		const scrPC = storeRef.current.screenPublisher;
		if (!scrPC) return null;
		const sender = scrPC.getSenders().find(s => s.track && s.track.kind === 'video');
		return sender?.track ?? null;
	};

	// Crea/recicla un PC de pantalla DIRECTO para un viewer y envía la oferta dirigida
	const sendDirectScreenOfferTo = async (viewerSocketId: string) => {
		try {
			let pc = screenPCsRef.current[viewerSocketId];

			if (!pc || pc.signalingState === 'closed') {
				pc = createPeerConnection({
					iceServers: STUN_SERVERS,
					onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, viewerSocketId),
					onTrack: (ev) => {
						// El streamer no debería recibir onTrack aquí, solo por logging defensivo.
						console.log('[[STREAMER]] screenPC onTrack inesperado -> viewer=%s kind=%s', viewerSocketId, ev.track.kind);
					},
				});
				screenPCsRef.current[viewerSocketId] = pc;

				// Añadimos la track de pantalla clonada (una por PC)
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
				// Si existe, asegúrate de que tenga el sender de video
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
			signaling.emitScreenOffer(offer, viewerSocketId); // ← SIEMPRE dirigida
		} catch (err) {
			console.error('[[STREAMER]] sendDirectScreenOfferTo error -> viewer=%s', viewerSocketId, err);
		}
	};

	// =======================================================

	useEffect(() => {
		console.log('[[CLT]] joinStream streamId=%s isStreamer=%s', streamId, isStreamer);
		signaling.joinStream(accessCode);

		// Snapshot de estado actual del stream (lo envía el backend al unirse)
		signaling.onCurrentStreamState?.(({ isSharingScreen, isStreamerMuted, viewersCount, hasCamera, hasMic }) => {
			if (typeof isSharingScreen === 'boolean') setIsScreenSharing(isSharingScreen);
			if (typeof hasCamera === 'boolean') setCamOn(hasCamera);
			if (typeof hasMic === 'boolean') setMicOn(hasMic);
			console.log('[[STATE]] snapshot -> screen=%s cam=%s mic=%s viewers=%s muted=%s',
						isSharingScreen, hasCamera, hasMic, viewersCount, isStreamerMuted);
		});

		// STREAMER: pedido de pantalla de un viewer tardío → oferta DIRECTA usando un PC por viewer
		signaling.onRequestScreenShare(({ viewerSocketId }) => {
			console.log('[[CLT]] onRequestScreenShare viewer=%s', viewerSocketId);
			sendDirectScreenOfferTo(viewerSocketId);
		});

		// VIEWER mic
		if (!isStreamer) {
			startViewerMic()
			.then((ms) => {
				viewerMicRef.current = ms;
				console.log('[[VIEWER]] mic ready tracks=%d', ms.getAudioTracks().length);
			})
			.catch((e) => console.error('[[VIEWER]] mic error', e));
		}

		// STREAMER media
		if (isStreamer) {
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

				// ► OFERTA BROADCAST (cam/mic inicial) como fallback
				pc.createOffer().then((offer) => {
					pc.setLocalDescription(offer);
					lastOfferPcRef.current = pc;
					console.log('[[CLT-SIG]] emitOffer BROADCAST (cam/mic) sdpType=%s', offer.type);
					signaling.emitOffer(offer); // broadcast
				});

				// ► OFERTA DIRIGIDA (cam/mic) cuando un viewer la solicite
				signaling.onRequestOffer(({ viewerSocketId }) => {
					console.log('[[CLT]] onRequestOffer viewer=%s', viewerSocketId);

					let pcDir = storeRef.current.perViewer[viewerSocketId];
					if (pcDir && pcDir.signalingState !== 'closed') {
						console.log('[[CLT]] reusing perViewer PC for %s (signaling=%s)', viewerSocketId, pcDir.signalingState);
					} else {
						pcDir = createPeerConnection({
							iceServers: STUN_SERVERS,
							onIce: (e) => e.candidate && signaling.emitIce(e.candidate, viewerSocketId),
							onTrack: (ev) => {
								// (si reenvías audio del viewer al streamer; aquí solo attach por si usas algo)
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

						// Añadir tracks si faltan
						const sendKinds = new Set(pcDir.getSenders().map(s => s.track?.kind));
						localStreamRef.current?.getTracks().forEach((t) => {
							if (!sendKinds.has(t.kind)) {
								pcDir!.addTrack(t, localStreamRef.current!);
								console.log('[[CLT-PC]] perViewer addTrack kind=%s id=%s -> %s', t.kind, t.id, viewerSocketId);
							} else {
								console.log('[[CLT-PC]] sender for kind=%s already present -> %s', t.kind, viewerSocketId);
							}
						});
					}

					pcDir.createOffer().then(async (off) => {
						await pcDir!.setLocalDescription(off);
						console.log('[[CLT-SIG]] emitOffer DIRECTA (cam/mic) to=%s sdpType=%s', viewerSocketId, off.type);
						signaling.emitOffer(off, viewerSocketId);
					});
				});
			})
			.catch(console.error);
		}

		// VIEWER: recibir oferta de cam/mic del streamer
		signaling.onOffer(async ({ offer, from }) => {
			if (isStreamer) return;

			console.log('[[VIEWER]] onOffer from=%s type=%s', from, offer?.type);

			const pc = createPeerConnection({
				iceServers: STUN_SERVERS,
				onIce: (e) => e.candidate && signaling.emitIce(e.candidate, from),
				onTrack: (ev) => {
					const [remote] = ev.streams;
					console.log('[[VIEWER]] ontrack kind=%s a=%d v=%d',
								ev.track.kind, remote.getAudioTracks().length, remote.getVideoTracks().length);

								attachStreamToVideo('remoteVideo', remote);

								// 🔊 asegurar audio
								const videoEl = document.getElementById('remoteVideo') as HTMLVideoElement | null;
								if (videoEl) {
									videoEl.muted = false;
									const p = videoEl.play?.();
									if (p && typeof p.catch === 'function') {
										p.catch((err: any) => {
											console.warn('[[VIEWER]] video.play() blocked (autoplay?)', err);
										});
									}
								}
				},
			});

			storeRef.current.perStreamer[from] = pc;

			// adjunta mic del viewer si existe (para hablar al streamer)
			viewerMicRef.current?.getAudioTracks().forEach((t) => {
				pc.addTrack(t, viewerMicRef.current!);
				console.log('[[VIEWER]] addTrack mic to pc for from=%s id=%s', from, t.id);
			});

			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			console.log('[[VIEWER-SIG]] emitAnswer to=%s type=%s', from, answer.type);
			signaling.emitAnswer(answer, from);
		});

		// STREAMER: recibir ANSWER (dirigidas o fallback broadcast) para cam/mic
		signaling.onAnswer(async (payload) => {
			if (!isStreamer) return;
			const answer = payload?.answer ?? payload;
			const from = (payload as any)?.from;

			console.log('[[CLT]] onAnswer from=%s type=%s', from ?? '(broadcast)', answer?.type);

			if (from) {
				const pc = storeRef.current.perViewer[from];
				if (pc) {
					if (pc.signalingState !== 'have-local-offer') {
						console.warn('[[CLT]] ignoring duplicate/late answer from=%s, signaling=%s', from, pc.signalingState);
						return;
					}
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(answer));
						console.log('[[CLT]] setRemoteDescription OK (dirigida) from=%s', from);
					} catch (e) {
						console.warn('[[CLT]] setRemoteDescription (dirigida) error', e);
					}
					return;
				}
			}

			// Fallback broadcast (solo para la primera oferta de cam/mic)
			if (lastOfferPcRef.current) {
				const pc = lastOfferPcRef.current;
				if (pc.signalingState !== 'have-local-offer') {
					console.warn('[[CLT]] ignoring broadcast answer (no have-local-offer), signaling=%s', pc.signalingState);
					return;
				}
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(answer));
					console.log('[[CLT]] setRemoteDescription OK (broadcast fallback)');
				} catch (e) {
					console.warn('[[CLT]] Fallback ANSWER error', e);
				}
			}
		});

		// ICE universal (cam/mic)
		signaling.onIce(async ({ from, candidate }) => {
			const target = isStreamer
				? storeRef.current.perViewer[from]
				: storeRef.current.perStreamer[from];
				if (!target) {
					console.log('[[ICE]] got candidate but no target PC for from=%s (maybe race)', from);
					return;
				}
				await safeAddIce(target, candidate);
				console.log('[[ICE]] addIceCandidate OK for from=%s', from);
		});

		// VIEWER: recibir oferta de PANTALLA (dirigida)
		signaling.onScreenOffer(async ({ offer, from }) => {
			if (isStreamer) return;

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
								p.catch((err: any) => console.warn('[[VIEWER]] screen video.play() blocked', err));
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

			// Estado estable recomendado para responder
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
								p.catch((err: any) => console.warn('[[VIEWER]] screen video.play() blocked', err));
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
				const ans = await pc.createAnswer();
				await pc.setLocalDescription(ans);
				console.log('[[VIEWER-SIG]] emitScreenAnswer to=%s type=%s', from, ans.type);
				signaling.emitScreenAnswer(ans, from); // dirigida
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

		// STREAMER: recibir ANSWER de pantalla (dirigida por viewer)
		signaling.onScreenAnswer(async ({ answer, from }) => {
			console.log('[[CLT]] onScreenAnswer from=%s type=%s', from ?? '(unknown)', answer?.type);
			if (!from) return;

			const pc = screenPCsRef.current[from];
			if (!pc) {
				console.log('[[CLT]] screenPC inexistente para from=%s; esperando ICE/rehacer si es necesario', from);
				return;
			}

			if (pc.signalingState === 'have-local-offer') {
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(answer));
					console.log('[[CLT]] screenPC setRemoteDescription OK (from=%s)', from);

					// Aplica candidatos de pantalla que llegaron antes del answer
					const pend = pendingScreenCandidatesRef.current[from] ?? [];
					for (const c of pend) await safeAddIce(pc, c);
					pendingScreenCandidatesRef.current[from] = [];
				} catch (e) {
					console.warn('[[CLT]] screenPC setRemoteDescription error (from=%s)', from, e);
				}
			}
		});

		// ICE de pantalla (dirigido por viewer)
		signaling.onScreenIce(async ({ candidate, from }) => {
			if (!from) return;
			const pc = screenPCsRef.current[from];
			if (!pc) {
				console.log('[[ICE]] screen cand sin PC (from=%s) -> guardando pendiente', from);
				if (!pendingScreenCandidatesRef.current[from]) pendingScreenCandidatesRef.current[from] = [];
				pendingScreenCandidatesRef.current[from].push(candidate);
				return;
			}
			await safeAddIce(pc, candidate);
			console.log('[[ICE]] screen addIceCandidate OK for from=%s', from);
		});

		if (signaling.onStopScreenShare) {
			signaling.onStopScreenShare(() => {
				console.log(isStreamer ? '[[STREAMER]] stop-screen-share' : '[[VIEWER]] stop-screen-share', '→ clearRemoteScreen()');
				clearRemoteScreen();
				// Si es streamer, cierra PCs de pantalla dedicados
				if (isStreamer) {
					Object.values(screenPCsRef.current).forEach((pc) => { try { pc.close(); } catch {} });
					screenPCsRef.current = {};
					pendingScreenCandidatesRef.current = {};
				}
			});
		}

		// otros eventos
		signaling.onUpdateViewers(({ viewers }) => {
			console.log('[[CLT]] update-viewers size=%d', viewers?.length ?? 0);
			setViewers(viewers);
		});

		signaling.onStreamEnded(() => {
			console.log('[[CLT]] stream-ended → cleanup');
			stopLocalMedia();
			onStreamEnd?.();
		});

		signaling.onKicked(() => {
			console.warn('[[CLT]] kicked → leave');
			kicked.current = true;
			handleLeaveStream();
		});

		signaling.onStreamError(({ message }) => {
			console.warn('[[CLT]] stream-error:', message);
			if (message.toLowerCase().includes('expulsado')) {
				kicked.current = true;
				handleLeaveStream();
			}
		});

		// VIEWER: al entrar o reconectar, solicita pantalla (sin pasar sock.id; backend usa socket.id por defecto)
		if (!isStreamer) {
			console.log('[[VIEWER]] request-screen-share (initial)');
			signaling.requestScreenShare(); // sin parámetro
			sock.on('connect', () => {
				console.log('[[VIEWER]] request-screen-share (reconnect)');
				signaling.requestScreenShare(); // sin parámetro
			});
		}

		// cleanup
		return () => {
			console.log('[[CLT]] cleanup useStreamConnection');
			signaling.leaveStream();
			signaling.offAll();
			stopLocalMedia();
			stopTracks(localStreamRef.current);
			stopTracks(viewerMicRef.current);
			closeAll(storeRef.current);

			// Cerrar PCs de pantalla por viewer
			Object.values(screenPCsRef.current).forEach((pc) => {
				try { pc.close(); } catch {}
			});
			screenPCsRef.current = {};
			pendingScreenCandidatesRef.current = {};

			sock.off('connect');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signaling, isStreamer]);

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

		kickViewer: (id: string) => sock.emit(EVENTS.KICK_VIEWER, { streamId, viewerId: id }),
		handleLeaveStream,
		wasKicked: kicked.current,
	};
};

