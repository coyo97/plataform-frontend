import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import {useSocket} from '../../../shared/hooks/useSocket';
import { EVENTS } from '../../../../utils/socket/events';
import { useRef } from 'react';

interface Viewer {
	_id: string;
	username: string;
}

interface UseStreamConnectionProps {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd?: () => void;   // callback opcional cuando el stream termina
}

export const useStreamConnection = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
}: UseStreamConnectionProps) => {
	/* ──────────────────────── estados ──────────────────────── */
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
	const [screenPeerConnection, setScreenPeerConnection] = useState<RTCPeerConnection | null>(null);
	const [viewers, setViewers] = useState<Viewer[]>([]);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
	const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
	const [localStream,      setLocalStream]      = useState<MediaStream | null>(null);
	const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
	const [scrPC, setScrPC] = useState<RTCPeerConnection|null>(null);
	const sock = useSocket();  

	const [isCamOn, setCamOn] = useState(true);
	const [isMicOn, setMicOn] = useState(true);
	const pendingViewers = useRef<string[]>([]);
	const toggleCamera = () => {
		const track = localStream?.getVideoTracks()?.[0];
		if (!track) return;
		track.enabled = !track.enabled;
		setCamOn(track.enabled);
		sock.emit(EVENTS.TOGGLE_CAMERA, { streamId, enabled: track.enabled });
	};

	const toggleMic = () => {
		const track = localStream?.getAudioTracks()?.[0];
		if (!track) return;
		track.enabled = !track.enabled;
		setMicOn(track.enabled);
		sock.emit(EVENTS.TOGGLE_MIC, { streamId, enabled: track.enabled });
	};
	const [isSharing,      setSharing]        = useState(false);
	const kicked           = useRef(false);        // ⬅️  NUEVO
	const socket           = useSocket();
	const peerRef          = useRef<RTCPeerConnection|null>(null);
	const screenRef        = useRef<RTCPeerConnection|null>(null);
	const localStreamRef   = useRef<MediaStream|null>(null);
	const pc2Ref = useRef<RTCPeerConnection|null>(null);
	const leaveStream = () => {
		// 1) cortamos media
		localStreamRef.current?.getTracks().forEach(t => t.stop());
		peerRef.current?.getSenders().forEach(s => s.track?.stop());
		screenRef.current?.getSenders().forEach(s => s.track?.stop());
		peerRef.current?.close();
		screenRef.current?.close();

		// 2) avisamos al backend
		socket.emit(EVENTS.LEAVE_STREAM, { streamId });

		// 3) limpiamos vídeos y storage
		['localVideo','remoteVideo','screenVideo'].forEach(id=>{
			const v=document.getElementById(id) as HTMLVideoElement|null;
			if (v) v.srcObject = null;
		});
		localStorage.removeItem('joinedStreamId');
		localStorage.removeItem('isViewer');
		localStorage.removeItem('accessCode');

		// 4) callback a la página contenedora
		onStreamEnd?.();
	};
	const log = (...args: any[]) =>
		console.log(`[%cSCREEN%c]`, 'color:#0af', 'color:inherit', ...args);

	/* ───────────────────── inicialización ───────────────────── */
	useEffect(() => {

		sock.emit(EVENTS.JOIN_STREAM, { streamId, accessCode });
		/* unirse a la sala */

		/* peer conexión principal */
		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		pc.onicecandidate = (e) => {
			if (e.candidate) sock.emit('ice-candidate', streamId, e.candidate);
		};

		/* ───── streamer ───── */
		if (isStreamer) {
			navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setLocalStream(stream);                // ⬅ guardar referencia

				if (pc.signalingState === 'closed') {
					console.warn('RTCPeerConnection was closed before tracks were added.');
					return;
				}
				const video = document.getElementById('localVideo') as HTMLVideoElement | null;
				if (video) video.srcObject = stream;
				stream.getTracks().forEach((t: MediaStreamTrack) => pc.addTrack(t, stream));
				setPeerConnection(pc);

				pc.createOffer().then((offer) => {
					pc.setLocalDescription(offer);
					sock.emit('offer', streamId, offer);
				});
				// … (dentro del if isStreamer) …


			})	.catch(console.error);
		} 
		/* ───── viewer ───── */
		else {
			/* viewer ─ recibe pistas (cámara, pantalla, audio) */
			pc.ontrack = ev => {
				const [remoteStream] = ev.streams;

				const camVideo   = document.getElementById('remoteVideo')  as HTMLVideoElement | null;
				const screenVideo= document.getElementById('screenVideo')  as HTMLVideoElement | null;

				if (ev.track.kind === 'video') {
					// la mayoría de navegadores ponen “screen” o “window” en el label
					if (ev.track.label.toLowerCase().includes('screen') ||
						ev.track.label.toLowerCase().includes('window')) {
						if (screenVideo && screenVideo.srcObject !== remoteStream) {
							screenVideo.srcObject = remoteStream;
						}
					} else {
						if (camVideo && camVideo.srcObject !== remoteStream) {
							camVideo.srcObject = remoteStream;
						}
					}
				} else if (ev.track.kind === 'audio') {
					// el audio lo reproducimos en el mismo elemento de cámara
					if (camVideo && camVideo.srcObject !== remoteStream) {
						camVideo.srcObject = remoteStream;
					}
				}
			};

			setPeerConnection(pc);
		}

		/* ───────── sockets comunes ───────── */
		sock.on(EVENTS.OFFER, async (offer) => {
			if (!isStreamer && pc) {
				if (pc.signalingState !== 'stable') return;
				await pc.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);
				sock.emit('answer', streamId, answer);
			}
		});

		sock.on(EVENTS.ANSWER, async (answer) => {
			if (isStreamer && pc) {
				if (pc.signalingState !== 'have-remote-offer') return;
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
			}
		});

		// ② al recibir candidatos:
		sock.on(EVENTS.ICE_CANDIDATE, async (cand) => {
			if (!pc) return;

			if (pc.remoteDescription) {
				await pc.addIceCandidate(new RTCIceCandidate(cand));
			} else {
				pendingCandidates.current.push(cand);
			}
		});
		socket.on('kicked', () => {
			kicked.current = true;
			leaveStream();
		});

		socket.on('stream-error', ({ message }) => {
			if (message.toLowerCase().includes('expulsado')) {
				kicked.current = true;      // bandera que lee StreamPlayer
				leaveStream();              // cierra media  limpieza
			}
		});

		sock.on(EVENTS.UPDATE_VIEWERS, ({ viewers }) => setViewers(viewers));
		/* stream finalizado */
		sock.on(EVENTS.STREAM_ENDED, () => {
			stopLocalMedia();          // ⬅ corta cámara y micrófono
			onStreamEnd?.();

		});
		/* ––––– listeners para cámara / micrófono ––––– */
		if (!isStreamer) {
			sock.on(EVENTS.TOGGLE_CAMERA, ({ enabled }) => {
				const remote = document.getElementById('remoteVideo') as HTMLVideoElement | null;
				const track = (remote?.srcObject as MediaStream | null)?.getVideoTracks()?.[0];
				if (track) track.enabled = enabled;
			});

			sock.on(EVENTS.TOGGLE_MIC, ({ enabled }) => {
				const remote = document.getElementById('remoteVideo') as HTMLVideoElement | null;
				const track = (remote?.srcObject as MediaStream | null)?.getAudioTracks()?.[0];
				if (track) track.enabled = enabled;
			});
		}
		/* ═════════════════════════ viewer – pantalla (pc2) ═════════════════════ */
		if (!isStreamer) {
			const pc2 = new RTCPeerConnection({
				iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
			});

			pc2Ref.current = pc2;

			pc2.ontrack = ev => {
				const video = document.getElementById('screenVideo') as HTMLVideoElement | null;
				if (video && video.srcObject !== ev.streams[0]) video.srcObject = ev.streams[0];
			};

			/* oferta desde el streamer */
			sock.on('screen-share-offer', async ({ offer }) => {
				await pc2.setRemoteDescription(new RTCSessionDescription(offer));

				if (pc2.signalingState === 'have-remote-offer') {   // solo 1.ª vez
					const answer = await pc2.createAnswer();
					await pc2.setLocalDescription(answer);
					sock.emit('screen-share-answer', { streamId, answer });
				} else {
					console.log('[viewer] offer duplicada – state =', pc2.signalingState);
				}
			});

			/* ICE desde el streamer */
			sock.on('screen-share-ice', async ({ candidate }) => {
				try { await pc2.addIceCandidate(new RTCIceCandidate(candidate)); }
				catch (e) { console.error('addIce (viewer) err', e); }
			});

			/* el streamer dejó de compartir */
			sock.on('stop-screen-share', () => {
				pc2.close();
				const v = document.getElementById('screenVideo') as HTMLVideoElement | null;
				if (v) v.srcObject = null;
			});
		}

		/* limpieza al desmontar hook */
		return () => {
			stopLocalMedia();
			sock.emit(EVENTS.LEAVE_STREAM, { streamId });
			pc.close();
			screenPeerConnection?.close();
			pc2Ref.current?.close();          // 🔸 asegura cerrado
			sock.off(EVENTS.TOGGLE_CAMERA).off(EVENTS.TOGGLE_MIC)
			.off('screen-share-offer')
			.off('screen-share-ice')
			.off('stop-screen-share');
		};
	}, []);
	/* ───────────────────────── listeners de pantalla (streamer) ───────────────────────── */
	useEffect(() => {
		if (!isStreamer) return;               // ← solo el dueño del stream
		const addScrPcDebug = (pc: RTCPeerConnection | null) => {
			if (!pc) return;
			pc.onconnectionstatechange = () =>
				log('scrPC state →', pc.connectionState);
			pc.oniceconnectionstatechange = () =>
				log('scrPC ICE →', pc.iceConnectionState);
			pc.onicecandidate = e =>
				log('scrPC local ICE →', !!e.candidate && e.candidate.candidate);
		};
		addScrPcDebug(scrPC)
		/* llega desde el backend cada nuevo viewer */
		const sendScreenOfferTo = async (viewerSocketId: string) => {
			if (!scrPC) return;

			// ⬇️  sin pistas → no se ofrece nada
			if (scrPC.getSenders().length === 0) {
				log('   -- scrPC sin pistas; se omite oferta');
				return;
			}

			const offer = await scrPC.createOffer();
			await scrPC.setLocalDescription(offer);
			sock.emit('screen-share-offer', { streamId, offer, to: viewerSocketId });
			log('🏷  oferta enviada a', viewerSocketId);
		};


		/* cuando entra un nuevo espectador */
		sock.on('request-screen-share', ({ viewerSocketId }) => {
			log('⭢  request-screen-share de', viewerSocketId);

			// A) aún no he pulsado “Compartir pantalla”
			// A) el streamer aún NO ha pulsado “Compartir pantalla”
			if (!scrPC || scrPC.signalingState === 'closed') {
				pendingViewers.current.push(viewerSocketId);   // ⬅️  guárdalo
				return;
			}
			// si la PC está negociando, encolamos
			if (scrPC.signalingState !== 'stable') {                  // 🆕
				pendingViewers.current.push(viewerSocketId);
				return;
			}
			// caso normal: podemos enviar la oferta ya
			sendScreenOfferTo(viewerSocketId);
		});
		/* cuando la PC pasa a stable, despachamos la cola */
		if (scrPC) {
			scrPC.onsignalingstatechange = () => {
				if (scrPC.signalingState === 'stable' &&
					pendingViewers.current.length > 0) {
					const queue = pendingViewers.current.splice(0);
				queue.forEach(sendScreenOfferTo);
				}
			};
		}


		// ⬇ listeners GLOBALes: existen desde que se monta el hook
		sock.on('screen-share-answer', async ({ answer }) => {
			if (!scrPC) return;

			if (scrPC.signalingState === 'have-local-offer') {     // ✅  sólo 1.ª vez
				await scrPC.setRemoteDescription(new RTCSessionDescription(answer));

				// flush ICE pendientes una única vez
				for (const c of pendingCandidates.current) {
					await scrPC.addIceCandidate(new RTCIceCandidate(c));
				}
				pendingCandidates.current = [];
			} else {
				console.log('[streamer] answer duplicada – state =', scrPC.signalingState);
			}
		});


		sock.on('screen-share-ice', async ({ candidate }) => {
			log('⬅  screen-share-ice', candidate.candidate);
			if (!scrPC) return;
			await scrPC.addIceCandidate(new RTCIceCandidate(candidate));
		});

		return () => {
			sock.off('request-screen-share')
			.off('screen-share-answer')
			.off('screen-share-ice');
			pc2Ref.current?.close();                   // <- cierra la PC de pantalla
		};

	}, [sock, isStreamer, scrPC]);

	/* ───────────────────── acciones helper ──────────────────── */
	const startScreenShare = async () => {
		if (scrPC) return;                       // ya está compartiendo

		const scrStream = await (navigator.mediaDevices as any)
		.getDisplayMedia({ video: true });
		const screenTrack = scrStream.getVideoTracks()[0];

		const pc2 = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		/* señalización para pantalla --------------------------------- */
		pc2.onicecandidate = e => {
			if (e.candidate) sock.emit('screen-share-ice', {
				streamId, candidate: e.candidate,
			});
		};

		pc2.addTrack(screenTrack, scrStream);
		setScrPC(pc2);
		setIsScreenSharing(true);

		const offer = await pc2.createOffer();
		await pc2.setLocalDescription(offer);
		sock.emit('screen-share-offer', { streamId, offer });

		/* mostrar localmente la pantalla */
		const el = document.getElementById('screenVideo') as HTMLVideoElement|null;
		if (el) el.srcObject = scrStream;

		/* corta pantalla desde el navegador (botón detiene) */
		screenTrack.onended = stopScreenShare;
	};


	const stopScreenShare = async () => {
		if (!scrPC) return;
		scrPC.getSenders().forEach(s => s.track?.stop());
		scrPC.close();
		setScrPC(null);
		setIsScreenSharing(false);
		sock.emit('stop-screen-share', { streamId });
		/* limpia el elemento de vídeo */
		const el = document.getElementById('screenVideo') as HTMLVideoElement|null;
		if (el) el.srcObject = null;
	}

	const startRecording = () => {
		const vid = document.getElementById(isStreamer ? 'localVideo' : 'remoteVideo') as HTMLVideoElement | null;
		if (vid && vid.srcObject) {
			const recorder = new MediaRecorder(vid.srcObject as MediaStream);
			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) setRecordedChunks((p) => [...p, e.data]);
			};
			recorder.start();
			setMediaRecorder(recorder);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaRecorder.onstop = () => {
				const blob = new Blob(recordedChunks, { type: 'video/webm' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `stream_${streamId}.webm`;
				a.click();
				URL.revokeObjectURL(url);
				setRecordedChunks([]);
			};
		}
	};

	const kickViewer = (viewerId: string) =>
		sock.emit(EVENTS.KICK_VIEWER, { streamId, viewerId });

	const handleLeaveStream = () => {
		stopLocalMedia();
		sock.emit(EVENTS.LEAVE_STREAM, { streamId });
		onStreamEnd?.();
	};
	const stopLocalMedia = () => {
		/* 1. cortar pistas */
		localStream?.getTracks().forEach(t => t.stop());
		peerConnection?.getSenders().forEach(s => s.track?.stop());
		screenPeerConnection?.getSenders().forEach(s => s.track?.stop());
		/* 2. cerrar peers */
		peerConnection?.close();
		screenPeerConnection?.close();
		/* 3. limpiar vídeo HTML */
		['localVideo', 'screenVideo', 'remoteVideo'].forEach(id => {
			const v = document.getElementById(id) as HTMLVideoElement | null;
			if (v) v.srcObject = null;
		});
	};

	return {
		/* estados */
		viewers,
		isScreenSharing,
		isCamOn,
		isMicOn,
		/* helpers de control de pantalla y grabación */
		startScreenShare,
		stopScreenShare,
		startRecording,
		stopRecording,
		toggleCamera,
		toggleMic,
		/* helpers de gestión */
		kickViewer      : (id:string)=>
			socket.emit(EVENTS.KICK_VIEWER,{ streamId, viewerId:id }),
		handleLeaveStream,
		wasKicked: kicked.current,
	};
};

