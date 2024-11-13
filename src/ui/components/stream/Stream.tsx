import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';
import axios from 'axios';

interface StreamProps {
  userId: string;
  streamId: string;
  isStreamer: boolean;
}

const Stream: React.FC<StreamProps> = ({ userId, streamId, isStreamer }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { HOST, SERVICE } = getEnvVariables();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [screenSharePeerConnection, setScreenSharePeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(HOST, { auth: { token } });

    setSocket(newSocket);

    // Unirse a la sala de stream
    newSocket.emit('join-stream', streamId);

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
        </div>
      ) : (
        <div>
          <p>Viendo el stream...</p>
          <video id="remoteVideo" autoPlay style={{ width: '300px' }}></video>
          <video id="screenVideo" autoPlay style={{ width: '300px' }}></video>
        </div>
      )}
    </div>
  );
};

export default Stream;

