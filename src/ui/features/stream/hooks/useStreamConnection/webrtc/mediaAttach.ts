// src/ui/features/stream/hooks/useStreamConnection/webrtc/mediaAttach.ts


export function attachStreamToVideo(elId: string, stream: MediaStream) {
  const el = document.getElementById(elId) as HTMLVideoElement | null;
  if (!el) return;

  // Ajustes pro-autoplay
  el.autoplay = true;
  el.playsInline = true;

  // Si ya está el mismo objeto, no lo reasignes para evitar AbortError
  if (el.srcObject !== stream) {
    el.srcObject = stream;
  }

  // Intentar reproducir sin romper si el navegador bloquea
  const p = el.play?.();
  if (p && typeof (p as any).catch === 'function') {
    (p as Promise<void>).catch(() => {});
  }

  // Backup por si algunos navegadores requieren esperar metadata
  el.onloadedmetadata = () => {
    const pp = el.play?.();
    if (pp && typeof (pp as any).catch === 'function') {
      (pp as Promise<void>).catch(() => {});
    }
  };
}

/**
 * Adjunta un MediaStream LOCAL (self preview) a un <video>.
 * Se fuerza muted=true por defecto para evitar bloqueos de autoplay.
 */
export function attachLocalPreview(
  videoId: string,
  ms: MediaStream,
  opts?: { muted?: boolean }
) {
  const el = document.getElementById(videoId) as HTMLVideoElement | null;
  if (!el) return;

  el.autoplay = true;
  el.playsInline = true;
  el.muted = opts?.muted ?? true;

  if (el.srcObject !== ms) {
    el.srcObject = ms;
  }

  const p = el.play?.();
  if (p && typeof (p as any).catch === 'function') {
    (p as Promise<void>).catch(() => {});
  }

  // Mostrar si estaba oculto por CSS
  el.style.display = 'block';
}

/**
 * Limpia un <video>: quita srcObject, resetea y lo oculta (opcional).
 */
export function clearVideoEl(videoId: string, hide: boolean = true) {
  const v = document.getElementById(videoId) as HTMLVideoElement | null;
  if (!v) return;
  // Detach stream de forma segura
  v.srcObject = null;
  v.removeAttribute('src');
  try {
    v.load(); // resetea el elemento
  } catch {}
  if (hide) v.style.display = 'none';
}

