type Ctx = {
  isStreamer: boolean;
  signaling: {
    onIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
    onScreenIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
  };
  storeRef: React.MutableRefObject<any>;
  screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
  pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
  safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;
};

export function setupIceHandlers(ctx: Ctx) {
  const {
    isStreamer,
    signaling,
    storeRef,
    screenPCsRef,
    pendingScreenCandidatesRef,
    safeAddIce,
  } = ctx;

  // De-dup simple por clave candidate (cam/mic)
  const seenCamIce = new Set<string>();
  // De-dup simple por clave candidate (screen) por socketId
  const seenScreenIce: Record<string, Set<string>> = {};

  const iceKey = (c: RTCIceCandidateInit) =>
    `${c.sdpMid ?? ''}|${c.sdpMLineIndex ?? ''}|${c.candidate ?? ''}`;

  const onIceMaybe = signaling.onIce(async ({ from, candidate }) => {
    const target = isStreamer
      ? storeRef.current.perViewer[from]
      : storeRef.current.perStreamer[from];

    if (!target) {
      console.log('[[ICE]] got candidate but no target PC for from=%s (maybe race)', from);
      return;
    }

    const key = iceKey(candidate);
    if (seenCamIce.has(key)) {
      // Evita duplicados en renegociaciones
      return;
    }
    seenCamIce.add(key);

    await safeAddIce(target, candidate);
    console.log('[[ICE]] addIceCandidate OK (cam/mic) for from=%s', from);
  });

  const onScrIceMaybe = signaling.onScreenIce(async ({ candidate, from }) => {
    if (!from) return;

    const key = iceKey(candidate);
    if (!seenScreenIce[from]) seenScreenIce[from] = new Set<string>();
    if (seenScreenIce[from].has(key)) return;
    seenScreenIce[from].add(key);

    const pc = screenPCsRef.current[from];
    if (!pc) {
      console.log('[[ICE]] screen cand sin PC (from=%s) -> guardando pendiente', from);
      if (!pendingScreenCandidatesRef.current[from]) pendingScreenCandidatesRef.current[from] = [];
      pendingScreenCandidatesRef.current[from].push(candidate);
      return;
    }
    await safeAddIce(pc, candidate);
    console.log('[[ICE]] screen addIceCandidate OK for from=%s', from);
  });

  return () => {
    if (typeof onIceMaybe === 'function') onIceMaybe();
    if (typeof onScrIceMaybe === 'function') onScrIceMaybe();
  };
}

