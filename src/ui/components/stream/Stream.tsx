// src/ui/components/stream/Stream.tsx

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';

interface StreamProps {
	userId: string;
	streamId: string;
	isStreamer: boolean;
}

const Stream: React.FC<StreamProps> = ({ userId, streamId, isStreamer }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const { HOST } = getEnvVariables();
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const newSocket = io(HOST, { auth: { token } });

		setSocket(newSocket);

		// Unirse a la sala de stream
		newSocket.emit('join-stream', streamId);

		const pc = new RTCPeerConnection();

		pc.onicecandidate = (event) => {
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

					stream.getTracks().forEach(track => pc.addTrack(track, stream));
					setPeerConnection(pc);

					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);
					newSocket.emit('offer', streamId, offer);
				} catch (error) {
					console.error('Error al acceder a la cámara/micrófono:', error);
				}
			};
			startStreaming();
		} else {
			pc.ontrack = (event) => {
				const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
				if (remoteVideo) {
					remoteVideo.srcObject = event.streams[0];
				}
			};
			setPeerConnection(pc);
		}

		newSocket.on('offer', async (offer) => {
			if (!isStreamer && peerConnection) {
				await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await peerConnection.createAnswer();
				await peerConnection.setLocalDescription(answer);
				newSocket.emit('answer', streamId, answer);
			}
		});

		newSocket.on('answer', async (answer) => {
			if (isStreamer && peerConnection) {
				await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
			}
		});

		newSocket.on('ice-candidate', (candidate) => {
			if (peerConnection) {
				peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
			}
		});

		return () => {
			if (peerConnection) {
				peerConnection.close();
			}
			newSocket.close();
		};
	}, [streamId]);

	return (
		<div>
			<h1>Stream {streamId}</h1>
			{isStreamer ? (
				<div>
					<p>Transmitiendo...</p>
					<video id="localVideo" autoPlay muted style={{ width: '300px' }}></video>
				</div>
			) : (
				<div>
					<p>Viendo el stream...</p>
					<video id="remoteVideo" autoPlay style={{ width: '300px' }}></video>
				</div>
			)}
		</div>
	);
};

export default Stream;

