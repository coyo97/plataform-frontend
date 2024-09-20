import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';

interface StreamProps {
  userId: string;
  streamId: string;
}

const Stream: React.FC<StreamProps> = ({ userId, streamId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { HOST } = getEnvVariables();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(HOST, { auth: { token } });

    setSocket(newSocket);

    // Unirse a la sala de stream
    newSocket.emit('join-stream', streamId);

    newSocket.on('offer', async (offer) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        newSocket.emit('answer', streamId, answer);
      }
    });

    newSocket.on('answer', async (answer) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    newSocket.on('ice-candidate', (candidate) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      newSocket.close();
    };
  }, [streamId]);

  const handleStartStream = async () => {
    if (socket) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoElement = document.getElementById('localVideo') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
        }

        const pc = new RTCPeerConnection();
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', streamId, event.candidate);
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', streamId, offer);

        setPeerConnection(pc);
        setIsStreaming(true);
      } catch (error) {
        console.error('Error al acceder a la cámara/micrófono:', error);
      }
    }
  };

  return (
    <div>
      <h1>Stream {streamId}</h1>
      {!isStreaming ? (
        <button onClick={handleStartStream}>Iniciar Stream</button>
      ) : (
        <div>
          <p>Transmitiendo...</p>
          <video id="localVideo" autoPlay muted style={{ width: '300px' }}></video>
        </div>
      )}
    </div>
  );
};

export default Stream;

