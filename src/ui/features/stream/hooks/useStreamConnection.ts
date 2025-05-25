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
	const sock = useSocket();  

	const [isSharing,      setSharing]        = useState(false);
	const kicked           = useRef(false);        // ⬅️  NUEVO
	const socket           = useSocket();
	const peerRef          = useRef<RTCPeerConnection|null>(null);
	const screenRef        = useRef<RTCPeerConnection|null>(null);
	const localStreamRef   = useRef<MediaStream|null>(null);

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
			})	.catch(console.error);
		} 
		/* ───── viewer ───── */
		else {
			pc.ontrack = (ev) => {
				const remote = document.getElementById('remoteVideo') as HTMLVideoElement | null;
				if (remote) remote.srcObject = ev.streams[0];
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
				leaveStream();              // cierra media + limpieza
			}
		});

		sock.on(EVENTS.UPDATE_VIEWERS, ({ viewers }) => setViewers(viewers));

		/* pantalla compartida iniciada por streamer */
		sock.on(EVENTS.START_SCREEN_SHARE, () => {
			if (!isStreamer) {
				const scrPC = new RTCPeerConnection({
					iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
				});
				setPeerConnection(scrPC);
				scrPC.ontrack = (ev) => {
					const video = document.getElementById('screenVideo') as HTMLVideoElement | null;
					if (video) video.srcObject = ev.streams[0];
				};
				setScreenPeerConnection(scrPC);
			}
		});

		/* stream finalizado */
		sock.on(EVENTS.STREAM_ENDED, () => {
			stopLocalMedia();          // ⬅ corta cámara y micrófono
			onStreamEnd?.();

		});
		/* limpieza */
		/* limpieza al desmontar hook */
		return () => {
			stopLocalMedia();
			sock.emit(EVENTS.LEAVE_STREAM, { streamId });
			pc.close();
			screenPeerConnection?.close();
		};
	}, []);

	/* ───────────────────── acciones helper ──────────────────── */
	const startScreenShare = async () => {
		const scrStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
		const scrVideo = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (scrVideo) scrVideo.srcObject = scrStream;

		const scrPC = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});
		scrStream.getTracks().forEach((t: MediaStreamTrack) => scrPC.addTrack(t, scrStream));

		setScreenPeerConnection(scrPC);
		setIsScreenSharing(true);
	};

	const stopScreenShare = () => {
		if (screenPeerConnection) {
			screenPeerConnection.getSenders().forEach((s) => s.track?.stop());
			screenPeerConnection.close();
			setScreenPeerConnection(null);
			setIsScreenSharing(false);
		}
	};

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


	/* ───────────────────── retorno del hook ─────────────────── */
	return {
		/* estados */
		viewers,
		isScreenSharing,

		/* helpers de control de pantalla y grabación */
		startScreenShare,
		stopScreenShare,
		startRecording,
		stopRecording,

		/* helpers de gestión */
		kickViewer      : (id:string)=>
			socket.emit(EVENTS.KICK_VIEWER,{ streamId, viewerId:id }),
		handleLeaveStream,
		wasKicked: kicked.current,
	};
};

