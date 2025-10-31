// src/ui/features/stream/hooks/useStreamsFeed.ts
import * as api from '../../../../async/services/streamService';
import type { Stream } from '../../../../types/stream';
import { EVENTS } from '../../../../utils/socket/events';
import {
  useRealtimeFeed,
  RegisterFn,
} from '../../../shared/hooks/useRealtimeFeed';

/** Util: dedupe + merge conservador por _id */
function upsertStream(list: Stream[], incoming: Stream, prepend = true): Stream[] {
  const idx = list.findIndex(x => x._id === incoming._id);
  if (idx === -1) {
    return prepend ? [incoming, ...list] : [...list, incoming];
  }
  const merged: Stream = { ...list[idx], ...incoming };
  const next = list.slice();
  next[idx] = merged;
  return next;
}

/** Util: marca un stream como terminado cuando no recibimos el payload completo */
function markEnded(list: Stream[], streamId: string): Stream[] {
  const idx = list.findIndex(x => x._id === streamId);
  if (idx === -1) return list;
  const prev = list[idx];
  const merged: Stream = {
    ...prev,
    active: false,
    endedAt: prev.endedAt ?? new Date().toISOString(),
  };
  const next = list.slice();
  next[idx] = merged;
  return next;
}

/** Util: quita por id */
function removeById(list: Stream[], streamId: string): Stream[] {
  return list.filter(x => x._id !== streamId);
}

/** Util: actualiza likes de forma idempotente */
function toggleLike(list: Stream[], streamId: string, userId: string, like: boolean): Stream[] {
  return list.map(x => {
    if (x._id !== streamId) return x;
    const has = x.likes.includes(userId);
    if (like && !has)   return { ...x, likes: [...x.likes, userId] };
    if (!like && has)   return { ...x, likes: x.likes.filter(id => id !== userId) };
    return x;
  });
}

/** Util: viewerCount desde viewers[] o número directo */
function applyViewerCount(list: Stream[], streamId: string, payload: any): Stream[] {
  const count =
    typeof payload?.viewerCount === 'number'
      ? payload.viewerCount
      : Array.isArray(payload?.viewers)
        ? payload.viewers.length
        : undefined;
  if (typeof count !== 'number') return list;
  return list.map(x => (x._id === streamId ? { ...x, viewerCount: count } : x));
}

type FeedType = 'live' | 'ended' | 'all';

/**
 * Hook de feed en tiempo real:
 * - fetch inicial: api.list(query)
 * - sockets: CREATED, ENDED, LIKE, UPDATE_VIEWERS (+ opcional UPDATED)
 * - dedupe en CREATED
 * - manejo de ENDED dependiente de `type`
 * - reconciliación al reconectar (fetch de lista)
 */
export const useStreamsFeed = (type: FeedType = 'live') => {
  const query =
    type === 'live'  ? '?live=true'  :
    type === 'ended' ? '?ended=true' :
                        '';

  const register: RegisterFn<Stream> = (socket, set) => {
    /** Reconciliación al reconectar el socket (por si se perdieron eventos) */
    const onReconnect = async () => {
      try {
        const fresh = await api.list(query);
        set(() => fresh);
      } catch {
        // silencio: si falla la reconciliación, mantenemos el cache actual
      }
    };

    /** STREAM_CREATED: insertar o actualizar (dedupe) */
    const onCreated = (payload: any) => {
      // aceptamos {stream} o el stream plano
      const s: Stream = payload?.stream ?? payload;
      if (!s || !s._id) return;
      set(prev => upsertStream(prev, s, /*prepend*/ true));
    };

    /**
     * STREAM_ENDED:
     * - live: remover (o marcar inactive si prefieres no "saltar" la UI)
     * - ended: si llega stream completo, agregar/prepender; si solo streamId, ignorar (o fetch puntual)
     * - all: actualizar activo=false (con endedAt si viene) o marcar como finalizado
     */
    const onEnded = (payload: any) => {
      const stream: Stream | undefined = payload?.stream;
      const streamId: string | undefined = payload?.streamId ?? stream?._id;
      if (!streamId) return;

      set(prev => {
        if (type === 'live') {
          // UX: remover del listado en vivo
          return removeById(prev, streamId);
        }
        if (type === 'ended') {
          if (stream && stream._id) {
            // tenemos datos -> agregar/actualizar en finalizados
            const normalized: Stream = { ...stream, active: false, endedAt: stream.endedAt ?? new Date().toISOString() };
            return upsertStream(prev, normalized, true);
          }
          // no hay datos del stream: no podemos construir la tarjeta -> dejamos la lista como está
          return prev;
        }
        // type === 'all'
        if (stream && stream._id) {
          const normalized: Stream = { ...stream, active: false, endedAt: stream.endedAt ?? new Date().toISOString() };
          return upsertStream(prev, normalized, /*prepend*/ false);
        }
        return markEnded(prev, streamId);
      });
    };

    /** STREAM_LIKE: actualiza likes idempotente */
    const onLike = (payload: any) => {
      const { streamId, userId, like } = payload || {};
      if (!streamId || !userId || typeof like !== 'boolean') return;
      set(prev => toggleLike(prev, streamId, userId, like));
    };

    /** UPDATE_VIEWERS: acepta {viewerCount} o {viewers:[]}, aplica al stream correspondiente */
    const onUpdateViewers = (payload: any) => {
      const streamId = payload?.streamId;
      if (!streamId) return;
      set(prev => applyViewerCount(prev, streamId, payload));
    };

    /**
     * (Opcional) STREAM_UPDATED:
     * Acepta {stream} completo o {streamId, patch}
     */
    const onUpdated = (payload: any) => {
      const stream: Stream | undefined = payload?.stream;
      const streamId: string | undefined = payload?.streamId ?? stream?._id;
      const patch: Partial<Stream> | undefined = payload?.patch ?? stream;
      if (!streamId || !patch) return;
      const normalized = { ...patch } as Stream;
    };

    // Suscripciones
    socket.on('connect', onReconnect);
    socket.on(EVENTS.STREAM_CREATED, onCreated);
    socket.on(EVENTS.STREAM_ENDED,   onEnded);
    socket.on(EVENTS.STREAM_LIKE,    onLike);
    socket.on(EVENTS.UPDATE_VIEWERS, onUpdateViewers);
    // opcional: si tu backend lo emite

    // Limpieza
    return () => {
      socket.off('connect', onReconnect);
      socket.off(EVENTS.STREAM_CREATED, onCreated);
      socket.off(EVENTS.STREAM_ENDED,   onEnded);
      socket.off(EVENTS.STREAM_LIKE,    onLike);
      socket.off(EVENTS.UPDATE_VIEWERS, onUpdateViewers);
    };
  };

  // Mantengo tu misma API de retorno para no romper llamadas existentes
  const [streams] = useRealtimeFeed(() => api.list(query), register);

  return {
    streams,
    like:   api.like,
    unlike: api.unlike,
    create: api.create,
    stop:   api.stop,
    join:   api.join,
  };
};

