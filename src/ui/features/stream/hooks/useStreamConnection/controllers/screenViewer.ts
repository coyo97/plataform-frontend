// src/ui/features/stream/hooks/useStreamConnection/controllers/screenViewer.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';

type Ctx = {
  isStreamer: boolean;
  signaling: {
    onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string; origin?: string }) => void) => unknown;
    emitScreenIce: (candidate: RTCIceCandidateInit, to: string, origin?: string) => void;
    emitScreenAnswer: (answer: RTCSessionDescriptionInit, to: string, origin?: string) => void;
    onStopScreenShare?: (cb: () => void) => unknown;
  };
  storeRef: React.MutableRefObject<any>;
  clearRemoteScreen: () => void;

  // Para coordinar con iceHandlers
  screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
  pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
  safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;
};

export function setupScreenViewer(ctx: Ctx) {
  const {
    isStreamer,
    signaling,
    storeRef,
    clearRemoteScreen,
    screenPCsRef,
    pendingScreenCandidatesRef,
    safeAddIce,
  } = ctx;

  // Este handler sólo aplica en VIEWER (recibe pantalla del owner)
  const slotName = 'screenPublisher';

  const offOffer = signaling.onScreenOffer(async ({ offer, from, origin }) => {
    if (isStreamer) {
      // El host no atiende aquí (usa screenFromViewer.ts para pantallas de viewers)
      console.log('[[HOST]] onScreenOffer recibido en viewer-handler → skip');
      return;
    }

    // Clave compuesta para distinguir múltiples pantallas simultáneas:
    const ownerKey = `${from}:${origin ?? 'host'}`;
    console.log('[[VIEWER]] onScreenOffer from=%s origin=%s key=%s type=%s',
      from, origin ?? 'host', ownerKey, offer?.type);

    const makePc = () =>
      createPeerConnection({
        iceServers: STUN_SERVERS,
        onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, from, origin),
        onTrack: (ev) => {
          const [ms] = ev.streams;
          attachStreamToVideo('screenVideo', ms);
          const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
          if (el) {
            el.style.display = 'block';
            el.muted = false;
            el.playsInline = true;
            el.play?.().catch((err) => console.warn('[[VIEWER]] screen video.play() blocked', err));
          }
          ev.track.onended = () => clearRemoteScreen();
          ms.addEventListener('removetrack', () => {
            if (ms.getVideoTracks().length === 0) clearRemoteScreen();
          });
        },
      });

    // Asegurar PC válido
    let pc: RTCPeerConnection | undefined = storeRef.current[slotName];
    if (!pc || pc.signalingState === 'closed' || pc.connectionState === 'failed') {
      pc = makePc();
      storeRef.current[slotName] = pc;
    } else if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
      try { pc.close(); } catch {}
      pc = makePc();
      storeRef.current[slotName] = pc;
    }

    // Mapear por clave compuesta para que iceHandlers no pise conexiones
    screenPCsRef.current[ownerKey] = pc!;

    // Aplicar offer y responder
    await pc!.setRemoteDescription(new RTCSessionDescription(offer));
    if (pc!.signalingState === 'have-remote-offer') {
      const ans = await pc!.createAnswer();
      await pc!.setLocalDescription(ans);
      console.log('[[VIEWER-SIG]] emitScreenAnswer to=%s origin=%s type=%s', from, origin ?? 'host', ans.type);
      signaling.emitScreenAnswer(ans, from, origin);
    }

    // Drenar ICE pendientes
    const pend = pendingScreenCandidatesRef.current[ownerKey];
    if (pend?.length) {
      for (const c of pend) {
        try { await safeAddIce(pc!, c); } catch (e) {
          console.warn('[[VIEWER]] add ICE (pend) fail key=%s', ownerKey, e);
        }
      }
      pendingScreenCandidatesRef.current[ownerKey] = [];
    }

    pc!.onconnectionstatechange = () => {
      const st = pc!.connectionState;
      console.log('[[VIEWER]] screen pc connectionState=', st, 'key=', ownerKey);
      if (st === 'failed' || st === 'disconnected' || st === 'closed') {
        clearRemoteScreen();
        if (screenPCsRef.current[ownerKey] === pc) delete screenPCsRef.current[ownerKey];
      }
    };
  });

  let offStop: unknown;
  if (signaling.onStopScreenShare) {
    offStop = signaling.onStopScreenShare(() => {
      clearRemoteScreen();
      Object.values(screenPCsRef.current).forEach((pc) => { try { pc.close(); } catch {} });
      screenPCsRef.current = {};
      pendingScreenCandidatesRef.current = {};
    });
  }

  return () => {
    try { (offOffer as any)?.(); } catch {}
    try { (offStop as any)?.(); } catch {}
  };
}

