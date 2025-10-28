import { EVENTS } from '../../../../../../utils/socket/events';
import type {
  SocketLike, OfferPayload, AnswerPayload, IcePayload,
  ScreenOfferPayload, ScreenAnswerPayload, ScreenIcePayload,
  ViewerJoinedRequest
} from './types';

export function createSignalingClient(socket: SocketLike, streamId: string) {
  /* ───────── helpers ───────── */
  const requireTarget = (to?: string, label?: string) => {
    if (!to) {
      console.warn(`[SIG][${label}] missing "to" target — refusing broadcast`);
      return false;
    }
    // Nota: no podemos comparar contra socket.id desde aquí (no siempre expuesto),
    // el backend ya protege contra self-target. Igual validamos formato básico.
    return true;
  };
socket.onAny?.((ev: string, ...args: any[]) => {
  console.log('[SIG<-]', ev, args?.[0] ?? '');
});
const _emit = socket.emit.bind(socket);
socket.emit = (ev: string, payload?: any) => {
  console.log('[SIG->]', ev, payload ?? '');
  return _emit(ev, payload);
};
  /* ──────────────── EMIT ──────────────── */
  const joinStream = (accessCode?: string) =>
    socket.emit(EVENTS.JOIN_STREAM, { streamId, accessCode });

  const leaveStream = () =>
    socket.emit(EVENTS.LEAVE_STREAM, { streamId });

  // General peer (permitimos opcionalmente broadcast por retrocompatibilidad)
  const emitOffer = (offer: RTCSessionDescriptionInit, to?: string) =>
    socket.emit(EVENTS.OFFER, to ? { streamId, to, offer } : { streamId, offer });

  const emitAnswer = (answer: RTCSessionDescriptionInit, to: string) =>
    socket.emit(EVENTS.ANSWER, { streamId, to, answer });

  const emitIce = (candidate: RTCIceCandidateInit, to?: string) =>
    socket.emit(EVENTS.ICE_CANDIDATE, to ? { streamId, to, candidate } : { streamId, candidate });

  const requestOffer = (viewerSocketId: string) =>
    socket.emit('request-offer', { viewerSocketId, streamId });

  const requestScreenShare = (viewerSocketId?: string) =>
    socket.emit('request-screen-share', viewerSocketId ? { streamId, viewerSocketId } : { streamId });

  // Screen-share: exigir SIEMPRE "to"
  // Screen-share: permitir broadcast (offer) y dirigido (late joiners). Answer/ICE comúnmente dirigido.
  const emitScreenOffer = (offer: RTCSessionDescriptionInit, to?: string) => {
  if (!requireTarget(to, 'screen-offer')) return;
  socket.emit('screen-share-offer', { streamId, offer, to });
};

const emitScreenAnswer = (answer: RTCSessionDescriptionInit, to?: string) => {
  if (!requireTarget(to, 'screen-answer')) return;
  socket.emit('screen-share-answer', { streamId, answer, to });
};
const emitScreenIce = (candidate: RTCIceCandidateInit, to?: string) => {
  if (!requireTarget(to, 'screen-ice')) return;
  socket.emit('screen-share-ice', { streamId, candidate, to });
};

// 4) añade un helper para el owner (azúcar sintáctico)
const onStreamOwner = (cb: (d: { ownerSocketId?: string }) => void) =>
  socket.on('stream-owner', cb);

  /* ──────────────── ON ──────────────── */
  const onOffer = (cb: (p: OfferPayload) => void) =>
    socket.on(EVENTS.OFFER, ({ offer, from }) => cb({ offer, from }));

  const onAnswer = (cb: (p: AnswerPayload) => void) =>
    socket.on(EVENTS.ANSWER, (payload) => {
      // Backend ideal: { answer, from }
      if (payload?.from && payload?.answer) return cb(payload);
      // Fallback compat (viejo): { answer }
      cb({ answer: payload?.answer ?? payload, from: payload?.from });
    });

  const onIce = (cb: (p: IcePayload) => void) =>
    socket.on(EVENTS.ICE_CANDIDATE, ({ from, candidate }) => cb({ from, candidate }));

  const onRequestOffer = (cb: (p: ViewerJoinedRequest) => void) =>
    socket.on('request-offer', cb);

  const onRequestScreenShare = (cb: (p: ViewerJoinedRequest) => void) =>
    socket.on('request-screen-share', cb);

  const onScreenOffer = (cb: (p: ScreenOfferPayload) => void) =>
    socket.on('screen-share-offer', ({ offer, from }) => cb({ offer, from }));

  const onScreenAnswer = (cb: (p: ScreenAnswerPayload) => void) =>
    socket.on('screen-share-answer', (payload) => {
      if (payload?.from && payload?.answer) return cb(payload);
      cb({ answer: payload?.answer ?? payload, from: payload?.from });
    });

  const onScreenIce = (cb: (p: ScreenIcePayload) => void) =>
    socket.on('screen-share-ice', ({ from, candidate }) => cb({ from, candidate }));

  const onUpdateViewers = (cb: (d: { viewers: any[] }) => void) =>
    socket.on(EVENTS.UPDATE_VIEWERS, cb);

  const onStreamEnded = (cb: () => void) =>
    socket.on(EVENTS.STREAM_ENDED, cb);

  const onKicked = (cb: () => void) =>
    socket.on('kicked', cb);

  const onStreamError = (cb: (d: { message: string }) => void) =>
    socket.on('stream-error', cb);

  const onStopScreenShare = (cb: () => void) =>
    socket.on('stop-screen-share', cb);

  // Nuevo: snapshot de estado actual al unirse
  const onCurrentStreamState = (cb: (d: {
    isSharingScreen?: boolean;
    isStreamerMuted?: boolean;
    viewersCount?: number;
    hasCamera?: boolean;
    hasMic?: boolean;
  }) => void) => socket.on('current-stream-state', cb);

  const offAll = () => socket.off();

  /* ──────────────── RETURN ──────────────── */
  return {
    joinStream,
    leaveStream,

    emitOffer, emitAnswer, emitIce,
    requestOffer, requestScreenShare,

    emitScreenOffer, emitScreenAnswer, emitScreenIce,

    onOffer, onAnswer, onIce,
    onRequestOffer, onRequestScreenShare,
    onScreenOffer, onScreenAnswer, onScreenIce,
    onUpdateViewers, onStreamEnded,
    onKicked, onStreamError,
    onStopScreenShare,

    onCurrentStreamState,
onStreamOwner,
    offAll,
  };
}

