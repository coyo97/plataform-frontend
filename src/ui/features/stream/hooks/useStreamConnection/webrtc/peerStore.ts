// src/ui/features/stream/hooks/useStreamConnection/webrtc/peerStore.ts

export type PeerStore = {
  /** Streamer cam/mic (broadcast opcional) */
  publisher?: RTCPeerConnection;

  /** Streamer screen (cuando el host comparte su pantalla) */
  screenPublisher?: RTCPeerConnection;

  /** PCs del host hacia cada viewer (cam/mic del host que reciben los viewers) */
  perViewer: Record<string, RTCPeerConnection>;

  /** PCs del viewer hacia el host (cam/mic del viewer que recibe el host) */
  perStreamer: Record<string, RTCPeerConnection>;

  /** NUEVO: PC por viewer para recibir su pantalla en el host (host ← viewer screen) */
  perViewerScreen: Record<string, RTCPeerConnection>;

  /**
   * NUEVO: caché de pantallas activas por origen (socketId del viewer que comparte).
   * Se usa para RELAY a nuevos viewers.
   */
  viewerScreens: Record<string, MediaStream>;
};

export function createPeerStore(): PeerStore {
  return {
    perViewer: {},
    perStreamer: {},
    perViewerScreen: {}, // ← inicializado para evitar undefined
    viewerScreens: {},   // ← inicializado para evitar undefined
  };
}

export function closeAndDelete(pc?: RTCPeerConnection | null) {
  try { pc?.getSenders().forEach(s => s.track?.stop()); } catch {}
  try { pc?.close(); } catch {}
}

/** NUEVO: detener pistas de un MediaStream con seguridad */
function stopMediaStream(ms?: MediaStream | null) {
  if (!ms) return;
  try { ms.getTracks().forEach(t => t.stop()); } catch {}
}

export function closeAll(store: PeerStore) {
  // PCs principales
  closeAndDelete(store.publisher);
  closeAndDelete(store.screenPublisher);

  // PCs existentes
  Object.values(store.perViewer).forEach(closeAndDelete);
  Object.values(store.perStreamer).forEach(closeAndDelete);

  // NUEVO: PCs de pantallas por viewer
  Object.values(store.perViewerScreen || {}).forEach(closeAndDelete);

  // NUEVO: detener pantallas cacheadas
  if (store.viewerScreens) {
    Object.values(store.viewerScreens).forEach(stopMediaStream);
  }
}

