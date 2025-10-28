import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';

type Ctx = {
  isStreamer: boolean;
  signaling: {
    onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
    emitScreenIce: (candidate: RTCIceCandidateInit, to: string) => void;
    emitScreenAnswer: (answer: RTCSessionDescriptionInit, to: string) => void;
    onStopScreenShare?: (cb: () => void) => unknown;
  };
  storeRef: React.MutableRefObject<any>;
  clearRemoteScreen: () => void;
};

export function setupScreenViewer(ctx: Ctx) {
  const { isStreamer, signaling, storeRef, clearRemoteScreen } = ctx;

  //  antes: if (isStreamer) return () => {};
  //  ahora: siempre registramos el handler; el host necesita recibir la oferta del viewer.
  // Usamos diferentes "slots" para no pisar PCs:
  const slotName = isStreamer ? 'screenReceiver' : 'screenPublisher';

  const onMaybe = signaling.onScreenOffer(async ({ offer, from }) => {
    console.log(isStreamer
      ? '[[HOST]] onScreenOffer from=%s type=%s'
      : '[[VIEWER]] onScreenOffer from=%s type=%s',
      from, offer?.type);

    let pc: RTCPeerConnection | null = storeRef.current[slotName] ?? null;
    if (!pc || pc.signalingState === 'closed') {
      pc = createPeerConnection({
        iceServers: STUN_SERVERS,
        onIce: (e) => {
          if (e.candidate) {
            console.log(isStreamer
              ? '[SCRN][HOST] emit screen-ice → to='
              : '[SCRN][VIEWER] emit screen-ice → to=',
              from);
            signaling.emitScreenIce(e.candidate, from);
          }
        },
        onTrack: (ev) => {
          const [ms] = ev.streams;
          console.log(isStreamer
            ? '[[HOST]] screen ontrack a=%d v=%d'
            : '[[VIEWER]] screen ontrack a=%d v=%d',
            ms.getAudioTracks().length, ms.getVideoTracks().length);

          // Pintamos en #screenVideo (el host seguro quiere verlo; el viewer también podría, no hace daño)
          attachStreamToVideo('screenVideo', ms);
          const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
          if (el) {
            el.style.display = 'block';
            el.muted = false;
            el.playsInline = true;
            const p = el.play?.();
            if (p && typeof (p as any).catch === 'function') {
              (p as Promise<void>).catch((err) =>
                console.warn(isStreamer ? '[[HOST]] video.play() blocked' : '[[VIEWER]] video.play() blocked', err)
              );
            }
          }

          ev.track.onended = () => clearRemoteScreen();
          ms.addEventListener('removetrack', () => {
            if (ms.getVideoTracks().length === 0) clearRemoteScreen();
          });
        },
      });
      storeRef.current[slotName] = pc;
    }

    // Si el PC está en un estado raro, re-crear limpio
    if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
      try { pc.close(); } catch {}
      pc = createPeerConnection({
        iceServers: STUN_SERVERS,
        onIce: (e) => {
          if (e.candidate) signaling.emitScreenIce(e.candidate, from);
        },
        onTrack: (ev) => {
          const [ms] = ev.streams;
          attachStreamToVideo('screenVideo', ms);
          const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
          if (el) {
            el.style.display = 'block';
            el.muted = false;
            el.playsInline = true;
            const p = el.play?.();
            if (p && typeof (p as any).catch === 'function') {
              (p as Promise<void>).catch((err) =>
                console.warn('[[SCRN]] video.play() blocked', err)
              );
            }
          }
          ev.track.onended = () => clearRemoteScreen();
          ms.addEventListener('removetrack', () => {
            if (ms.getVideoTracks().length === 0) clearRemoteScreen();
          });
        },
      });
      storeRef.current[slotName] = pc;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    if (pc.signalingState === 'have-remote-offer') {
      const ans: RTCSessionDescriptionInit = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      console.log(isStreamer
        ? '[[HOST-SIG]] emitScreenAnswer to=%s type=%s'
        : '[[VIEWER-SIG]] emitScreenAnswer to=%s type=%s',
        from, ans.type);
      signaling.emitScreenAnswer(ans, from);
    }

    const pcLocal = pc;
    pcLocal.onconnectionstatechange = () => {
      const st = pcLocal.connectionState;
      console.log(isStreamer ? '[[HOST]] screen pc connectionState=' : '[[VIEWER]] screen pc connectionState=', st);
      if (st === 'failed' || st === 'disconnected' || st === 'closed') {
        clearRemoteScreen();
      }
    };
  });

  let unbindStopMaybe: unknown;
  if (ctx.signaling.onStopScreenShare) {
    unbindStopMaybe = ctx.signaling.onStopScreenShare(() => {
      console.log(isStreamer ? '[[HOST]] stop-screen-share → clearRemoteScreen()' : '[[VIEWER]] stop-screen-share → clearRemoteScreen()');
      clearRemoteScreen();
    });
  }

  return () => {
    if (typeof onMaybe === 'function') onMaybe();
    if (typeof unbindStopMaybe === 'function') unbindStopMaybe();
  };
}

