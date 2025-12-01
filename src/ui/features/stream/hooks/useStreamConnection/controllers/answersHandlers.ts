// controllers/answersHandlers.ts
type Ctx = {
  isStreamer: boolean;
  signaling: {
    onAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;
    onScreenAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
  };
  storeRef: React.MutableRefObject<{
    perViewer: Record<string, RTCPeerConnection>;
    perStreamer: Record<string, RTCPeerConnection>;
  }>;
  screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
  pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
  safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;

  // Viewer → Owner (cuando el viewer envía pantalla)
  viewerOutScreenPcRef?: React.MutableRefObject<RTCPeerConnection | null | undefined>;
};

export function setupAnswersHandlers(ctx: Ctx) {
  const {
    isStreamer,
    signaling,
    storeRef,
    screenPCsRef,
    pendingScreenCandidatesRef,
    safeAddIce,
    viewerOutScreenPcRef,
  } = ctx;

  // Buffer local para ICE de pantalla del VIEWER si llega antes del PC (lado viewer saliente)
  const pendingViewerScreenIce: RTCIceCandidateInit[] = [];

  /* ── ANSWER cam/mic (ruta normal, siempre dirigida con from) ── */
  const offAns = signaling.onAnswer(async ({ answer, from }) => {
    if (!from) return;

    if (isStreamer) {
      const pc = storeRef.current.perViewer?.[from];
      if (!pc) {
        console.warn('[[ANS]] (host) no perViewer PC for from=%s', from);
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[ANS]] (host) setRemoteDescription OK from=%s', from);
      } catch (e) {
        console.warn('[[ANS]] (host) setRemoteDescription fail from=%s', from, e);
      }
    } else {
      const pc = storeRef.current.perStreamer?.[from];
      if (!pc) {
        console.warn('[[ANS]] (viewer) no perStreamer PC for from=%s', from);
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[ANS]] (viewer) setRemoteDescription OK from=%s', from);
      } catch (e) {
        console.warn('[[ANS]] (viewer) setRemoteDescription fail from=%s', from, e);
      }
    }
  });

  /* ── ANSWER de compartir pantalla ── */
  const offScreenAns = signaling.onScreenAnswer(async ({ answer, from }) => {
    if (!from) return;

    // Host empujando pantalla hacia "from"
    const pcHostOut = screenPCsRef.current[from];
    if (pcHostOut && pcHostOut.signalingState !== 'closed') {
      try {
        await pcHostOut.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[ANS-SCREEN]] (host) setRemoteDescription OK from=%s', from);

        // Aplica ICE pendientes guardados para este viewer
        const pend = pendingScreenCandidatesRef.current[from] ?? [];
        if (pend.length) {
          for (const c of pend.splice(0)) {
            await safeAddIce(pcHostOut, c);
          }
          pendingScreenCandidatesRef.current[from] = [];
        }
      } catch (e) {
        console.warn('[[ANS-SCREEN]] (host) setRemoteDescription fail from=%s', from, e);
      }
      return;
    }

    // Viewer compartiendo hacia host (respuesta del host al viewer)
    const viewerOut = viewerOutScreenPcRef?.current ?? null;
    if (viewerOut && viewerOut.signalingState !== 'closed') {
      try {
        await viewerOut.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[ANS-SCREEN]] (viewer) setRemoteDescription OK from=%s', from);

        // Aplica ICE que llegaron antes en el viewer
        if (pendingViewerScreenIce.length) {
          for (const c of pendingViewerScreenIce.splice(0)) {
            await safeAddIce(viewerOut, c);
          }
        }
      } catch (e) {
        console.warn('[[ANS-SCREEN]] (viewer) setRemoteDescription fail from=%s', from, e);
      }
    }
  });

  // Todo el manejo de onIce / onScreenIce queda en controllers/iceHandlers.ts

  return () => {
    try { (offAns as any)?.(); } catch {}
    try { (offScreenAns as any)?.(); } catch {}
  };
}

