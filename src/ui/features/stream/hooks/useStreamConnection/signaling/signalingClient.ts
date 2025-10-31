// src/ui/features/stream/hooks/useStreamConnection/signaling/signalingClient.ts
import { EVENTS } from '../../../../../../utils/socket/events';
import type {
  SocketLike, OfferPayload, AnswerPayload, IcePayload,
  ScreenOfferPayload, ScreenAnswerPayload, ScreenIcePayload,
  ViewerJoinedRequest
} from './types';

export function createSignalingClient(socket: SocketLike, streamId: string) {
  // Instrumentación y estado de depuración
  let role: 'owner' | 'viewer' | 'unknown' = 'unknown';
  let lastOwnerSocketId: string | undefined;

  // Setter opcional desde fuera: signaling.setRole('owner' | 'viewer' | 'unknown')
  const setRole = (r: 'owner' | 'viewer' | 'unknown') => {
    role = r;
    console.log(`[SIG][role:set] stream=${streamId} role=${role}`);
  };
  const getOwnerSocketId = () => lastOwnerSocketId;

  const tag = () => `[SIG][${role}][stream:${streamId}]`;

   const endStream = () => {
   console.log(`${tag()} endStream()`);
   socket.emit(EVENTS.END_STREAM ?? 'end-stream', { streamId });
 };

  const requireTarget = (to?: string, label?: string) => {
    if (!to) {
      console.warn(`${tag()} ${label ?? 'emit'} missing "to" target — refusing broadcast`);
      return false;
    }
    return true;
  };

  // Log global de inbound (compacto)
  socket.onAny?.((ev: string, ...args: any[]) => {
    const p = args?.[0];
    const sdpLen =
      p?.offer?.sdp?.length ?? p?.answer?.sdp?.length ?? 0;
    const hasTo = typeof p?.to !== 'undefined';
    const hasFrom = typeof p?.from !== 'undefined';
    console.log(`${tag()} [IN] ${ev}`, {
      hasFrom, from: p?.from,
      hasTo,   to: p?.to,
      sdpLen,  hasCandidate: !!p?.candidate,
      origin:  p?.origin
    });
  });

  // Wrap de emit: log outbound
  const _emit = socket.emit.bind(socket);
  socket.emit = (ev: string, payload?: any) => {
    const sdpLen =
      payload?.offer?.sdp?.length ?? payload?.answer?.sdp?.length ?? 0;
    console.log(`${tag()} [OUT] ${ev}`, {
      to: payload?.to,
      hasTo: typeof payload?.to !== 'undefined',
      sdpLen,
      hasCandidate: !!payload?.candidate,
      origin: payload?.origin
    });
    return _emit(ev, payload);
  };

  const joinStream = (accessCode?: string) => {
    console.log(`${tag()} joinStream()`);
    socket.emit(EVENTS.JOIN_STREAM, { streamId, accessCode });
  };

  const leaveStream = () => {
    console.log(`${tag()} leaveStream()`);
    socket.emit(EVENTS.LEAVE_STREAM, { streamId });
  };

  // General peer — EXIGE 'to' (no-broadcast)
  const emitOffer = (offer: RTCSessionDescriptionInit, to?: string) => {
    if (!requireTarget(to, 'offer')) return;
    console.log(`${tag()} emitOffer()`, { to, sdpType: offer?.type });
    socket.emit(EVENTS.OFFER, { streamId, to, offer });
  };

  const emitAnswer = (answer: RTCSessionDescriptionInit, to: string) => {
    console.log(`${tag()} emitAnswer()`, { to, sdpType: answer?.type });
    socket.emit(EVENTS.ANSWER, { streamId, to, answer });
  };

  const emitIce = (candidate: RTCIceCandidateInit, to?: string) => {
    if (!requireTarget(to, 'ice')) return;
    console.log(`${tag()} emitIce()`, { to });
    socket.emit(EVENTS.ICE_CANDIDATE, { streamId, to, candidate });
  };

  const requestOffer = (viewerSocketId: string) => {
    console.log(`${tag()} requestOffer() -> owner`, { viewerSocketId });
    socket.emit('request-offer', { viewerSocketId, streamId });
  };

  const requestScreenShare = (viewerSocketId?: string) => {
    console.log(`${tag()} requestScreenShare() -> owner`, {
      viewerSocketId: viewerSocketId ?? '(self)'
    });
    socket.emit('request-screen-share', viewerSocketId ? { streamId, viewerSocketId } : { streamId });
  };

  /**
   * SCREEN-SHARE: exigir SIEMPRE "to" (modelo owner-republish)
   * `origin` es opcional y sirve para identificar al originador real (p.ej. viewer A) cuando el host relaya a B/C.
   */
  const emitScreenOffer = (offer: RTCSessionDescriptionInit, to?: string, origin?: string) => {
    if (!requireTarget(to, 'screen-offer')) return;
    console.log(`${tag()} emitScreenOffer()`, { to, sdpType: offer?.type, origin, ownerHint: lastOwnerSocketId });
    socket.emit('screen-share-offer', { streamId, offer, to, origin });
  };

  const emitScreenAnswer = (answer: RTCSessionDescriptionInit, to?: string, origin?: string) => {
    if (!requireTarget(to, 'screen-answer')) return;
    console.log(`${tag()} emitScreenAnswer()`, { to, sdpType: answer?.type, origin });
    socket.emit('screen-share-answer', { streamId, answer, to, origin });
  };

  const emitScreenIce = (candidate: RTCIceCandidateInit, to?: string, origin?: string) => {
    if (!requireTarget(to, 'screen-ice')) return;
    console.log(`${tag()} emitScreenIce()`, { to, origin });
    socket.emit('screen-share-ice', { streamId, candidate, to, origin });
  };

  // Azúcar: quién es el owner actual
  const onStreamOwner = (cb: (d: { ownerSocketId?: string }) => void) =>
    socket.on('stream-owner', (d: { ownerSocketId?: string }) => {
      lastOwnerSocketId = d?.ownerSocketId;
      console.log(`${tag()} [STATE] stream-owner`, { ownerSocketId: lastOwnerSocketId });
      cb(d);
    });

  const onOffer = (cb: (p: OfferPayload) => void) =>
    socket.on(EVENTS.OFFER, ({ offer, from }) => {
      console.log(`${tag()} onOffer() from=${from}`, { sdpType: offer?.type });
      cb({ offer, from });
    });

  const onAnswer = (cb: (p: AnswerPayload) => void) =>
    socket.on(EVENTS.ANSWER, (payload) => {
      const from = payload?.from;
      const answer = payload?.answer ?? payload;
      console.log(`${tag()} onAnswer() from=${from}`, { sdpType: answer?.type });
      cb({ answer, from });
    });

  const onIce = (cb: (p: IcePayload) => void) =>
    socket.on(EVENTS.ICE_CANDIDATE, ({ from, candidate }) => {
      console.log(`${tag()} onIce() from=${from}`, { hasCandidate: !!candidate });
      cb({ from, candidate });
    });

  const onRequestOffer = (cb: (p: ViewerJoinedRequest) => void) =>
    socket.on('request-offer', (p: ViewerJoinedRequest) => {
      console.log(`${tag()} onRequestOffer()`, p);
      cb(p);
    });

  const onRequestScreenShare = (cb: (p: ViewerJoinedRequest) => void) =>
    socket.on('request-screen-share', (p: ViewerJoinedRequest) => {
      console.log(`${tag()} onRequestScreenShare()`, p);
      cb(p);
    });

  // ── Incluimos `origin` en los callbacks de pantalla (puede no existir si es pantalla del host).
  const onScreenOffer = (cb: (p: ScreenOfferPayload & { origin?: string }) => void) =>
    socket.on('screen-share-offer', (raw: any) => {
      const { offer, from, origin } = raw || {};
      console.log(`${tag()} onScreenOffer() from=${from}`, { sdpType: offer?.type, origin });
      cb({ offer, from, origin } as any);
    });

  const onScreenAnswer = (cb: (p: ScreenAnswerPayload & { origin?: string }) => void) =>
    socket.on('screen-share-answer', (raw: any) => {
      const from = raw?.from;
      const answer = raw?.answer ?? raw;
      const origin = raw?.origin;
      console.log(`${tag()} onScreenAnswer() from=${from}`, { sdpType: answer?.type, origin });
      cb({ answer, from, origin } as any);
    });

  const onScreenIce = (cb: (p: ScreenIcePayload & { origin?: string }) => void) =>
    socket.on('screen-share-ice', (raw: any) => {
      const { from, candidate, origin } = raw || {};
      console.log(`${tag()} onScreenIce() from=${from}`, { hasCandidate: !!candidate, origin });
      cb({ from, candidate, origin } as any);
    });

  const onUpdateViewers = (cb: (d: { viewers: any[] }) => void) =>
    socket.on(EVENTS.UPDATE_VIEWERS, (d) => {
      console.log(`${tag()} onUpdateViewers()`, { count: d?.viewers?.length ?? 0 });
      cb(d);
    });

  const onStreamEnded = (cb: () => void) =>
    socket.on(EVENTS.STREAM_ENDED, () => {
      console.log(`${tag()} onStreamEnded()`);
      cb();
    });

  const onKicked = (cb: () => void) =>
    socket.on('kicked', () => {
      console.log(`${tag()} onKicked()`);
      cb();
    });

  const onStreamError = (cb: (d: { message: string }) => void) =>
    socket.on('stream-error', (d) => {
      console.error(`${tag()} onStreamError()`, d);
      cb(d);
    });

  const onStopScreenShare = (cb: () => void) =>
    socket.on('stop-screen-share', () => {
      console.log(`${tag()} onStopScreenShare()`);
      cb();
    });

  const onCurrentStreamState = (cb: (d: {
    isSharingScreen?: boolean;
    isStreamerMuted?: boolean;
    viewersCount?: number;
    hasCamera?: boolean;
    hasMic?: boolean;
  }) => void) =>
    socket.on('current-stream-state', (d) => {
      console.log(`${tag()} onCurrentStreamState()`, d);
      cb(d);
    });

  const offAll = () => {
    console.log(`${tag()} offAll()`);
    socket.off();
  };

  return {
    // flujo base
    joinStream,
    leaveStream,
endStream,
    // RTCPeerConnection genérico (siempre dirigido)
    emitOffer, emitAnswer, emitIce,
    requestOffer, requestScreenShare,

    // screen-share (owner-republish exige 'to')
    emitScreenOffer, emitScreenAnswer, emitScreenIce,

    // listeners
    onOffer, onAnswer, onIce,
    onRequestOffer, onRequestScreenShare,
    onScreenOffer, onScreenAnswer, onScreenIce,
    onUpdateViewers, onStreamEnded,
    onKicked, onStreamError,
    onStopScreenShare,
    onCurrentStreamState,
    onStreamOwner,

    // utilidades de depuración
    getOwnerSocketId,
    setRole,

    offAll,
  };
}

