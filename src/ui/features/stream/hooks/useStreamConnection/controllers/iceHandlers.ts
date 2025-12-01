// src/ui/features/stream/hooks/useStreamConnection/controllers/iceHandlers.ts
type Ctx = {
  isStreamer: boolean;
  signaling: {
    onIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
    onScreenIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit; origin?: string }) => void) => unknown;
  };
  storeRef: React.MutableRefObject<{
    perViewer: Record<string, RTCPeerConnection>;
    perStreamer: Record<string, RTCPeerConnection>;
  }>;
  screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
  pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
  safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;

  // Viewer → Owner (cuando el viewer envía pantalla)
  viewerOutScreenPcRef?: React.MutableRefObject<RTCPeerConnection | undefined>;
  ownerSocketIdRef?: React.MutableRefObject<string | undefined>;
};

export function setupIceHandlers(ctx: Ctx) {
  const {
    isStreamer,
    signaling,
    storeRef,
    screenPCsRef,
    pendingScreenCandidatesRef,
    safeAddIce,
    viewerOutScreenPcRef,
    ownerSocketIdRef,
  } = ctx;

  // De-dup para no aplicar el mismo ICE dos veces
  const seenCamIce = new Set<string>();
  const seenScreenIce = new Set<string>();

  const iceKey = (c: RTCIceCandidateInit) =>
    `${c.sdpMid ?? ''}|${c.sdpMLineIndex ?? ''}|${c.candidate ?? ''}`;

  // === ICE de cam/mic ===
  const offCamIce = signaling.onIce(async ({ from, candidate }) => {
    const pc = isStreamer
      ? storeRef.current.perViewer?.[from]
      : storeRef.current.perStreamer?.[from];

    if (!pc || pc.signalingState === 'closed') {
      console.log('[[ICE]] cam ICE sin PC objetivo from=%s (race)', from);
      return;
    }

    const key = iceKey(candidate);
    if (seenCamIce.has(key)) return;
    seenCamIce.add(key);

    try {
      await safeAddIce(pc, candidate);
      console.log('[[ICE]] cam add OK from=%s', from);
    } catch (e) {
      console.warn('[[ICE]] cam add FAIL from=%s', from, e);
    }
  });

  // === ICE de screen-share ===
  const offScreenIce = signaling.onScreenIce(async ({ candidate, from, origin }) => {
    if (!from) return;

    const keyStr = iceKey(candidate);
    if (seenScreenIce.has(keyStr)) return;
    seenScreenIce.add(keyStr);

    // 1) Caso normal: hay un PC en screenPCsRef indexado por el socketId remoto
    let pc = screenPCsRef.current[from];

    // 2) Fallback: viewer enviando pantalla hacia el owner
    //    Si estamos del lado viewer, y todavía no mapeamos el PC en screenPCsRef,
    //    intentamos usar viewerOutScreenPcRef cuando coincide el owner.
    if (!pc && !isStreamer && viewerOutScreenPcRef?.current) {
      const ownerId = ownerSocketIdRef?.current;
      const matchesOwner = !ownerId || ownerId === from;
      if (matchesOwner && viewerOutScreenPcRef.current.signalingState !== 'closed') {
        console.log('[[ICE][VIEWER→OWNER]] usando viewerOutScreenPcRef for from=%s', from);
        pc = viewerOutScreenPcRef.current;
        // Mapeamos para siguientes ICE
        screenPCsRef.current[from] = pc!;
      }
    }

    if (!pc || pc.signalingState === 'closed') {
      console.log('[[ICE]] screen ICE sin PC (from=%s) → buffer', from);
      (pendingScreenCandidatesRef.current[from] ||= []).push(candidate);
      return;
    }

    try {
      await safeAddIce(pc, candidate);
      console.log('[[ICE]] screen add OK from=%s (origin=%s)', from, origin ?? 'unknown');
    } catch (e) {
      console.warn('[[ICE]] screen add FAIL from=%s', from, e);
      (pendingScreenCandidatesRef.current[from] ||= []).push(candidate);
    }
  });

  return () => {
    try { (offCamIce as any)?.(); } catch {}
    try { (offScreenIce as any)?.(); } catch {}
  };
}

