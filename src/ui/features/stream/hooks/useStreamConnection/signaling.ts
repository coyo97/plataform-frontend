// src/ui/features/stream/hooks/useStreamConnection/signaling.ts
import { EVENTS } from '../../../../../utils/socket/events';
import { STUN_SERVERS } from './constants';

export const registerSignaling = (deps: {
  /* refs y helpers inyectados desde useStreamConnection */
  sock:   import('socket.io-client').Socket;
  socket: import('socket.io-client').Socket;
  isStreamer: boolean;
  streamId  : string;

  pcMain : RTCPeerConnection;                               // PC base del streamer (opcional)
  pcMap  : React.MutableRefObject<Record<string, RTCPeerConnection>>;          // streamer: viewerSocketId -> pc (cam/mic)
  viewerPcMap: React.MutableRefObject<Record<string, RTCPeerConnection>>;      // viewer: streamerSocketId -> pc (cam/mic)

  pc2Ref : React.MutableRefObject<RTCPeerConnection | null>; // pantalla (lado viewer, receptor)
  scrPC  : React.MutableRefObject<RTCPeerConnection | null>; // pantalla (lado streamer, maestro con pistas)

  pendingCandidates: React.MutableRefObject<RTCIceCandidateInit[]>;
  pendingViewers   : React.MutableRefObject<string[]>;

  setViewers:          (v: any) => void;
  setScrPC:            (pc: RTCPeerConnection | null) => void;
  setIsScreenSharing:  (b: boolean) => void;
  handleLeaveStream:   () => void;
  log: (...a: any[]) => void;
}) => {
  const {
    sock, socket, isStreamer, streamId,
    pcMain, pcMap, viewerPcMap,
    pc2Ref, scrPC,
    pendingCandidates, pendingViewers,
    setViewers, setScrPC, setIsScreenSharing,
    handleLeaveStream, log,
  } = deps;

  // ─────────────────────────────────────────────────────────────
  // NUEVO: mapa de PCs de pantalla por viewer (solo en el STREAMER)
  // ─────────────────────────────────────────────────────────────
  const screenSenders: Record<string, RTCPeerConnection> = {};

  /* ═════════════════════ 1) ANSWER (cam/mic) ═════════════════════ */
  // Esperamos que el backend reenvíe { answer, from }
  sock.on(EVENTS.ANSWER, async (payload: any) => {
    if (!isStreamer) return; // el viewer envía answer; el streamer la recibe
    const answer = payload?.answer ?? payload;
    const from   = payload?.from;

    // ruteo por socketId del viewer
    const target = from ? pcMap.current[from] : undefined;
    if (!target) {
      // fallback: si no hay 'from', intenta aplicarla a pcMain SOLO si estuviera esperando
      if (pcMain?.signalingState === 'have-local-offer') {
        try { await pcMain.setRemoteDescription(new RTCSessionDescription(answer)); } catch {}
      }
      return;
    }
    // Evita InvalidStateError si ya no está esperando
    if (target.signalingState !== 'have-local-offer') return;

    try {
      await target.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      console.warn('setRemoteDescription(answer) error', e);
    }
  });

  /* ═════════════════════ 2) ICE (cam/mic) ═════════════════════ */
  sock.on(EVENTS.ICE_CANDIDATE, async ({ from, candidate }) => {
    const target = isStreamer ? pcMap.current[from] : viewerPcMap.current[from];
    if (!target) return;
    try { await target.addIceCandidate(new RTCIceCandidate(candidate)); }
    catch (e) { console.warn('addIce error', e); }
  });

  /* ═════════════════════ 3) Kicked & stream-error ═════════════════════ */
  socket.on('kicked', handleLeaveStream);
  socket.on('stream-error', ({ message }) => {
    if (message.toLowerCase().includes('expulsado')) handleLeaveStream();
  });

  /* ═════════════════════ 4) Lista de viewers ═════════════════════ */
  sock.on(EVENTS.UPDATE_VIEWERS, ({ viewers }) => setViewers(viewers));

  /* ═════════════════════ 5A) (VIEWER) Oferta del STREAMER (cámara+audio) ══════════ */
  if (!isStreamer) {
    sock.on(EVENTS.OFFER, async ({ offer, from }) => {
      // Crea PC dedicada para ese streamer (socketId "from")
      const pcFromStreamer = new RTCPeerConnection({ iceServers: STUN_SERVERS });
      viewerPcMap.current[from] = pcFromStreamer;

      // (opcional) Añadir mic del viewer para hablar con el streamer
      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic.getAudioTracks().forEach(t => pcFromStreamer.addTrack(t, mic));
      } catch (e) {
        console.warn('viewer mic getUserMedia failed', e);
      }

      // Recibir audio+video del streamer en el <video id="remoteVideo">
      pcFromStreamer.ontrack = ev => {
        const cam = document.getElementById('remoteVideo') as HTMLVideoElement | null;
        if (cam && cam.srcObject !== ev.streams[0]) {
          cam.srcObject = ev.streams[0];
          cam.onloadedmetadata = () => cam.play().catch(() => {});
        }
      };

      // ICE dirigido: responder al mismo "from"
      pcFromStreamer.onicecandidate = e => {
        if (e.candidate)
          socket.emit(EVENTS.ICE_CANDIDATE, { streamId, to: from, candidate: e.candidate });
      };

      await pcFromStreamer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pcFromStreamer.createAnswer();
      await pcFromStreamer.setLocalDescription(answer);
      socket.emit(EVENTS.ANSWER, { streamId, to: from, answer });
    });
  }

  /* ═════════════════════ 5B) (VIEWER) Pantalla compartida del streamer (RECEPTOR) ═ */
  sock.on('screen-share-offer', async ({ offer, from }) => {
    let pc = pc2Ref.current;
    if (!pc || pc.signalingState === 'closed') {
      pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
      pc2Ref.current = pc;

      pc.ontrack = ev => {
        const video = document.getElementById('screenVideo') as HTMLVideoElement | null;
        if (video) {
          video.srcObject = ev.streams[0];
          video.style.display = 'block';
          (video as any).playsInline = true;
          video.muted = false;
          video.onloadedmetadata = () => video.play().catch(() => {});
        }
      };

      pc.onicecandidate = e => {
        if (e.candidate)
          sock.emit('screen-share-ice', { streamId, to: from, candidate: e.candidate });
      };
    }

    if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
      console.log('[viewer] ignorando oferta duplicada; state =', pc.signalingState);
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    if (pc.signalingState === 'have-remote-offer') {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sock.emit('screen-share-answer', { streamId, to: from, answer });
    }
  });

  sock.on('screen-share-ice', async ({ from, candidate }) => {
    try { await pc2Ref.current?.addIceCandidate(new RTCIceCandidate(candidate)); }
    catch (err) { console.error('addIce (viewer screen) err', err); }
  });

  sock.on('stop-screen-share', () => {
    pc2Ref.current?.close();
    pc2Ref.current = null;
    const vid = document.getElementById('screenVideo') as HTMLVideoElement | null;
    if (vid) { vid.srcObject = null; vid.style.display = 'none'; }
  });

  /* ═════════════════════ 6) (STREAMER) Pantalla por viewer (EMISOR por demanda) ═══ */
  // En lugar de usar scrPC para TODOS, creamos un PC por viewer y CLONAMOS pistas
  const createOrReplaceScreenSenderFor = (viewerSocketId: string): RTCPeerConnection | null => {
    const master = scrPC.current;
    if (!master) return null;

    const v = master.getSenders().find(s => s.track?.kind === 'video')?.track || null;
    const a = master.getSenders().find(s => s.track?.kind === 'audio')?.track || null;
    if (!v && !a) return null;

    // cierra/reemplaza si ya existía
    const prev = screenSenders[viewerSocketId];
    if (prev && prev.signalingState !== 'closed') {
      try { prev.getSenders().forEach(s => s.track?.stop()); } catch {}
      try { prev.close(); } catch {}
      delete screenSenders[viewerSocketId];
    }

    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
    screenSenders[viewerSocketId] = pc;

    // ICE dirigido a ese viewer
    pc.onicecandidate = (e) => {
      if (e.candidate)
        sock.emit('screen-share-ice', { streamId, to: viewerSocketId, candidate: e.candidate });
    };

    // Clona pistas de la captura maestro
    const tracks: MediaStreamTrack[] = [];
    if (v) tracks.push(v.clone());
    if (a) tracks.push(a.clone());
    const ms = new MediaStream(tracks);
    tracks.forEach(t => pc.addTrack(t, ms));

    return pc;
  };

  const sendScreenOfferTo = async (viewerSocketId: string) => {
    // Crea el PC emisor para ese viewer y ofrece
    const pc = createOrReplaceScreenSenderFor(viewerSocketId);
    if (!pc) {
      log('No hay pista de pantalla para ofrecer');
      return;
    }
    const off = await pc.createOffer();
    await pc.setLocalDescription(off);
    sock.emit('screen-share-offer', { streamId, offer: off, to: viewerSocketId });
  };

  // Viewer pide pantalla (backend reenvía al owner)
  sock.on('request-screen-share', ({ viewerSocketId }) => {
    if (!scrPC.current || scrPC.current.signalingState === 'closed') {
      pendingViewers.current.push(viewerSocketId);
      return;
    }
    if (scrPC.current.signalingState !== 'stable') {
      pendingViewers.current.push(viewerSocketId);
      return;
    }
    sendScreenOfferTo(viewerSocketId);
  });

  // Cuando el maestro de pantalla se estabiliza, atiende la cola
  if (scrPC.current) {
    scrPC.current.onsignalingstatechange = () => {
      if (scrPC.current!.signalingState === 'stable' && pendingViewers.current.length > 0) {
        const q = pendingViewers.current.splice(0);
        q.forEach(sendScreenOfferTo);
      }
    };
  }

  // STREAMER: recibe ANSWER de pantalla → aplicar al PC de ese viewer
  sock.on('screen-share-answer', async ({ answer, from }) => {
    if (!isStreamer) return;
    if (!from) return;
    const pc = screenSenders[from];
    if (!pc) return;
    if (pc.signalingState !== 'have-local-offer') return; // evita InvalidStateError
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      console.warn('screen setRemoteDescription error', e);
    }
  });

  // STREAMER: ICE de pantalla por viewer
  sock.on('screen-share-ice', async ({ from, candidate }) => {
    if (!isStreamer) return;
    if (!from) return;
    const pc = screenSenders[from];
    if (!pc) return;
    try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); }
    catch (e) { console.warn('screen addIce error', e); }
  });

  // Al detener pantalla, cierra todos los PCs por viewer
  sock.on('stop-screen-share', () => {
    if (isStreamer) {
      Object.keys(screenSenders).forEach((vid) => {
        try { screenSenders[vid].getSenders().forEach(s => s.track?.stop()); } catch {}
        try { screenSenders[vid].close(); } catch {}
        delete screenSenders[vid];
      });
    }
  });

  /* ═════════════════════ 7) cleanup ═════════════════════ */
  return () => sock.off(); // quita todos los listeners creados por este registro
};

