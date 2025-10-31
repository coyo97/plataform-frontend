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
  const seenScreenIce: Record<string, Set<string>> = {};

  const iceKey = (c: RTCIceCandidateInit) =>
    `${c.sdpMid ?? ''}|${c.sdpMLineIndex ?? ''}|${c.candidate ?? ''}`;

  // === ICE de cam/mic ===
  const offCamIce = signaling.onIce(async ({ from, candidate }) => {
    const pc = isStreamer
      ? storeRef.current.perViewer?.[from]
      : storeRef.current.perStreamer?.[from];

    if (!pc) {
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

  // === ICE de screen-share (usa clave compuesta `from:origin`) ===
  const offScreenIce = signaling.onScreenIce(async ({ candidate, from, origin }) => {
    if (!from) return;

    const keyStr = iceKey(candidate);
    const ownerKey = `${from}:${origin ?? 'host'}`;
    if (!seenScreenIce[ownerKey]) seenScreenIce[ownerKey] = new Set<string>();
    if (seenScreenIce[ownerKey].has(keyStr)) return;
    seenScreenIce[ownerKey].add(keyStr);

    // 1) Caso normal: host empuja pantalla a viewer con key `ownerKey`
    let pc = screenPCsRef.current[ownerKey];

    // 2) Fallback: viewer enviando pantalla hacia el owner
    if (!pc && !isStreamer && viewerOutScreenPcRef?.current) {
      const ownerId = ownerSocketIdRef?.current;
      const matchesOwner = !ownerId || ownerId === from; // si desconocemos owner, asumimos que 'from' es el owner
      if (matchesOwner) {
        console.log('[[ICE][VIEWER→OWNER]] usando viewerOutScreenPcRef para ownerKey=%s', ownerKey);
        pc = viewerOutScreenPcRef.current;
        if (pc && pc.signalingState !== 'closed') {
          // mapeo para futuros ICE
          screenPCsRef.current[ownerKey] = pc;
        }
      }
    }

    if (!pc) {
      console.log('[[ICE]] screen ICE sin PC (ownerKey=%s) → buffer', ownerKey);
      (pendingScreenCandidatesRef.current[ownerKey] ||= []).push(candidate);
      return;
    }

    try {
      await safeAddIce(pc, candidate);
      console.log('[[ICE]] screen add OK ownerKey=%s', ownerKey);
    } catch (e) {
      console.warn('[[ICE]] screen add FAIL ownerKey=%s', ownerKey, e);
      (pendingScreenCandidatesRef.current[ownerKey] ||= []).push(candidate);
    }
  });

  return () => {
    try { (offCamIce as any)?.(); } catch {}
    try { (offScreenIce as any)?.(); } catch {}
  };
}

