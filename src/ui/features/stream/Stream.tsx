import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';
import axios from 'axios';

interface StreamProps {
	userId: string;
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onLeaveStream?: () => void;
}

const Stream: React.FC<StreamProps> = ({ userId, streamId, isStreamer, accessCode , onLeaveStream}) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const { HOST, SERVICE } = getEnvVariables();
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
	const [screenSharePeerConnection, setScreenSharePeerConnection] = useState<RTCPeerConnection | null>(null);
	const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
	const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
	const [viewers, setViewers] = useState<{ _id: string; username: string }[]>([]);


	useEffect(() => {
		const token = localStorage.getItem('token');
		const newSocket = io(HOST, { auth: { token } });

		setSocket(newSocket);

		console.log('Enviando join-stream con:', { streamId, accessCode });
		// Unirse a la sala de stream
		newSocket.emit('join-stream', {streamId, accessCode});

		// Manejar errores
		newSocket.on('stream-error', (data) => {
			alert(data.message);
			// Opcionalmente, puedes redirigir al usuario o cerrar el componente
		});
		// Manejar el evento 'stream-ended'
		newSocket.on('stream-ended', (data) => {
			alert(data.message);
			// Cerrar conexiones y limpiar recursos
			if (peerConnection) {
				peerConnection.close();
			}
			if (screenSharePeerConnection) {
				screenSharePeerConnection.close();
			}
			newSocket.disconnect();
			// Opcionalmente, puedes actualizar el estado o redirigir al usuario
			if (onLeaveStream) {
				onLeaveStream();
			}
		});

		// Manejar el evento 'kicked' (expulsión)
		newSocket.on('kicked', (data) => {
			alert(data.message);
			handleLeaveStream();
		});

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
				newSocket.emit('ice-candidate', streamId, event.candidate);
			}
		};

		if (isStreamer) {
			const startStreaming = async () => {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
					const videoElement = document.getElementById('localVideo') as HTMLVideoElement;
					if (videoElement) {
						videoElement.srcObject = stream;
					}

					stream.getTracks().forEach((track: MediaStreamTrack) => pc.addTrack(track, stream));
					setPeerConnection(pc);

					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);
					newSocket.emit('offer', streamId, offer);
				} catch (error) {
					console.error('Error al acceder a la cámara/micrófono:', error);
				}
			};
			startStreaming();
			// Escuchar evento de actualización de espectadores
			newSocket.on('update-viewers', (data) => {
				setViewers(data.viewers);
			});
		} else {
			pc.ontrack = (event: RTCTrackEvent) => {
				console.log('Espectador recibió pista:', event.streams);
				const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
				if (remoteVideo) {
					remoteVideo.srcObject = event.streams[0];
				}
			};
			setPeerConnection(pc);
		}

		newSocket.on('offer', async (offer: RTCSessionDescriptionInit) => {
			console.log('Recibido evento "offer" con datos:', offer);
			if (!isStreamer && peerConnection) {
				await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await peerConnection.createAnswer();
				await peerConnection.setLocalDescription(answer);
				newSocket.emit('answer', streamId, answer);
			}
		});

		newSocket.on('answer', async (answer: RTCSessionDescriptionInit) => {
			console.log('Recibido evento "answer" con datos:', answer);
			if (isStreamer && peerConnection) {
				await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
			}
		});

		newSocket.on('ice-candidate', (candidate: RTCIceCandidateInit) => {
			console.log('Recibido evento "ice-candidate" con datos:', candidate);
			if (peerConnection) {
				peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
			}
		});

		// Eventos para la compartición de pantalla
		newSocket.on('start-screen-share', () => {
			console.log('Recibido evento "start-screen-share"');
			// Preparar para recibir la pantalla compartida
			if (!isStreamer) {
				const pc = new RTCPeerConnection({
					iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
				});

				pc.ontrack = (event: RTCTrackEvent) => {
					console.log('Espectador recibió pista de pantalla compartida:', event.streams);
					const screenVideo = document.getElementById('screenVideo') as HTMLVideoElement;
					if (screenVideo) {
						screenVideo.srcObject = event.streams[0];
					}
				};

				pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
					if (event.candidate) {
						newSocket.emit('screen-share-ice-candidate', { streamId, candidate: event.candidate });
					}
				};

				setScreenSharePeerConnection(pc);
			}
		});
		// Manejadores para 'stop-screen-share', 'screen-share-offer', etc.

		// Limpieza
		return () => {
			if (peerConnection) {
				peerConnection.close();
			}
			if (screenSharePeerConnection) {
				screenSharePeerConnection.close();
			}
			if (newSocket) {
				newSocket.off('offer');
				newSocket.off('answer');
				newSocket.off('ice-candidate');
				newSocket.off('start-screen-share');
				// ... limpia otros eventos
				newSocket.off('stream-error');
				newSocket.off('stream-ended');
				newSocket.off('kicked');
				newSocket.off('update-viewers');
				newSocket.disconnect();
			}
		};
	}, []); // Dependencias vacías para que se ejecute una sola vez

	// Funciones para iniciar y detener la compartición de pantalla
	const startScreenShare = async () => {
		try {
			const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
			const screenVideoElement = document.getElementById('screenVideo') as HTMLVideoElement;
			if (screenVideoElement) {
				screenVideoElement.srcObject = screenStream;
			}

			const pc = new RTCPeerConnection({
				iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
			});

			screenStream.getTracks().forEach((track: MediaStreamTrack) => pc.addTrack(track, screenStream));

			pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
				if (event.candidate) {
					socket?.emit('screen-share-ice-candidate', { streamId, candidate: event.candidate });
				}
			};

			setScreenSharePeerConnection(pc);
			setIsScreenSharing(true);

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			socket?.emit('screen-share-offer', { streamId, offer });

			// Notificar al backend que hemos iniciado la compartición de pantalla
			await axios.post(`${HOST}${SERVICE}/streams/${streamId}/shareScreen`, {}, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});

		} catch (error) {
			console.error('Error al compartir pantalla:', error);
		}
	};

	const stopScreenShare = async () => {
		if (screenSharePeerConnection) {
			screenSharePeerConnection.getSenders().forEach(sender => sender.track?.stop());
			screenSharePeerConnection.close();
			setScreenSharePeerConnection(null);
			setIsScreenSharing(false);

			// Notificar al backend que hemos detenido la compartición de pantalla
			await axios.delete(`${HOST}${SERVICE}/streams/${streamId}/shareScreen`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});
		}
	};
	const startRecording = () => {
		if (isStreamer) {
			const videoElement = document.getElementById('localVideo') as HTMLVideoElement;
			if (videoElement && videoElement.srcObject) {
				const mediaStream = videoElement.srcObject as MediaStream;
				const recorder = new MediaRecorder(mediaStream);
				recorder.ondataavailable = (event) => {
					if (event.data.size > 0) {
						setRecordedChunks((prev) => [...prev, event.data]);
					}
				};
				recorder.start();
				setMediaRecorder(recorder);
			}
		} else {
			const videoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
			if (videoElement && videoElement.srcObject) {
				const mediaStream = videoElement.srcObject as MediaStream;
				const recorder = new MediaRecorder(mediaStream);
				recorder.ondataavailable = (event) => {
					if (event.data.size > 0) {
						setRecordedChunks((prev) => [...prev, event.data]);
					}
				};
				recorder.start();
				setMediaRecorder(recorder);
			}
		}
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaRecorder.onstop = () => {
				const blob = new Blob(recordedChunks, { type: 'video/webm' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				document.body.appendChild(a);
				a.style.display = 'none';
				a.href = url;
				a.download = `stream_${streamId}.webm`;
				a.click();
				window.URL.revokeObjectURL(url);
				setRecordedChunks([]);
			};
		}
	};
	const handleLeaveStream = () => {
		// Cerrar conexiones y limpiar recursos
		if (peerConnection) {
			peerConnection.close();
		}
		if (screenSharePeerConnection) {
			screenSharePeerConnection.close();
		}
		socket?.disconnect();

		// Limpiar el estado en el componente padre (JoinStream)
		// Puedes pasar una función desde el componente padre para limpiar el estado

		// Limpiar localStorage
		localStorage.removeItem('joinedStreamId');
		localStorage.removeItem('isViewer');
		localStorage.removeItem('accessCode');

		if (onLeaveStream) {
			onLeaveStream();
		}
		// Opcionalmente, redirigir o actualizar el estado
	};

	// Función para expulsar a un espectador
	const kickViewer = (viewerId: string) => {
		socket?.emit('kick-viewer', { streamId, viewerId });
	};
	return (
		<div>
			<h1>Stream {streamId}</h1>
			{isStreamer ? (
				<div>
					<p>Transmitiendo...</p>
					<video id="localVideo" autoPlay muted style={{ width: '300px' }}></video>
					{isScreenSharing && (
						<div>
							<p>Compartiendo pantalla...</p>
							<video id="screenVideo" autoPlay muted style={{ width: '300px' }}></video>
						</div>
					)}
					<button onClick={isScreenSharing ? stopScreenShare : startScreenShare}>
						{isScreenSharing ? 'Detener Compartir Pantalla' : 'Compartir Pantalla'}
					</button>
					<button onClick={startRecording}>Iniciar Grabación</button>
					<button onClick={stopRecording}>Detener y Descargar Grabación</button>
					{/* Mostrar la lista de espectadores */}
					<h3>Espectadores:</h3>
					<ul>
						{viewers.map((viewer) => (
							<li key={viewer._id}>
								{viewer.username}
								{isStreamer && <button onClick={() => kickViewer(viewer._id)}>Expulsar</button>}
							</li>
						))}
					</ul>

				</div>
			) : (
				<div>
					<p>Viendo el stream...</p>
					<video id="remoteVideo" autoPlay style={{ width: '300px' }}></video>
					<video id="screenVideo" autoPlay style={{ width: '300px' }}></video>
					<button onClick={handleLeaveStream}>Salir del Stream</button>
				</div>
			)}
		</div>
	);
};

export default Stream;

