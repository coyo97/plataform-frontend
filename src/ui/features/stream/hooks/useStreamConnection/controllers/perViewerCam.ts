import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';
import { startViewerMic } from '../features/cameraMic';

type Ctx = {
  isStreamer: boolean;
  signaling: {
    onOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
    emitIce: (candidate: RTCIceCandidateInit, to: string) => void;
    emitAnswer?: (answer: RTCSessionDescriptionInit, to: string) => void;
  };
  storeRef: React.MutableRefObject<any>;
  viewerMicRef: React.MutableRefObject<MediaStream | null>;
};

export function setupPerViewerCam(ctx: Ctx) {
  const { isStreamer, signaling, storeRef, viewerMicRef } = ctx;

  if (!isStreamer) {
    // mic del viewer (una vez)
    startViewerMic()
      .then((ms) => {
        viewerMicRef.current = ms;
        console.log('[[VIEWER]] mic ready tracks=%d', ms.getAudioTracks().length);
      })
      .catch((e) => console.error('[[VIEWER]] mic error', e));

    // Evitar múltiples ANSWER por la misma oferta por viewer
    const answeredOnceRef = { current: {} as Record<string, boolean> };

    const offMaybe = signaling.onOffer(async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('[[VIEWER]] onOffer from=%s type=%s', from, offer?.type);

      // Reutiliza PC si existe; si está cerrado, crea nuevo
      let pc: RTCPeerConnection | undefined = storeRef.current.perStreamer[from];
      if (!pc || pc.signalingState === 'closed') {
        pc = createPeerConnection({
          iceServers: STUN_SERVERS,
          onIce: (e) => e.candidate && signaling.emitIce(e.candidate, from),
          onTrack: (ev) => {
            const [remote] = ev.streams;
            console.log(
              '[[VIEWER]] ontrack kind=%s a=%d v=%d',
              ev.track.kind,
              remote.getAudioTracks().length,
              remote.getVideoTracks().length
            );

            attachStreamToVideo('remoteVideo', remote);
            const videoEl = document.getElementById('remoteVideo') as HTMLVideoElement | null;
            if (videoEl) {
              videoEl.style.display = 'block';
              videoEl.muted = false;
              const p = videoEl.play?.();
              if (p && typeof p.catch === 'function') {
                p.catch((err: unknown) => {
                  console.warn('[[VIEWER]] video.play() blocked (autoplay?)', err);
                });
              }
            }
          },
        });
        storeRef.current.perStreamer[from] = pc;

        // Envía micro del viewer hacia el streamer
        viewerMicRef.current?.getAudioTracks().forEach((t) => {
          pc!.addTrack(t, viewerMicRef.current!);
          console.log('[[VIEWER]] addTrack mic to pc for from=%s id=%s', from, t.id);
        });

        pc.onconnectionstatechange = () => {
          const st = pc!.connectionState;
          if (st === 'failed' || st === 'disconnected' || st === 'closed') {
            try { pc!.close(); } catch {}
            storeRef.current.perStreamer[from] = undefined;
            // Permitir nuevamente responder si llega una nueva oferta
            answeredOnceRef.current[from] = false;
          }
        };
      }

      // Evita responder 2 veces a la misma oferta si por alguna razón se dispara doble
      if (answeredOnceRef.current[from]) {
        console.log('[[VIEWER]] ignoring duplicate offer flow from=%s (already answered)', from);
        return;
      }

      await pc!.setRemoteDescription(new RTCSessionDescription(offer));
      const answer: RTCSessionDescriptionInit = await pc!.createAnswer();
      await pc!.setLocalDescription(answer);
      answeredOnceRef.current[from] = true;

      console.log('[[VIEWER-SIG]] emitAnswer to=%s type=%s', from, answer.type);
      signaling.emitAnswer?.(answer, from);
    });

    return () => {
      if (typeof offMaybe === 'function') offMaybe();
    };
  }

  return () => {};
}

