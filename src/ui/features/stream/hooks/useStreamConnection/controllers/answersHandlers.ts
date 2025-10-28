// controllers/answersHandlers.ts
type SignalAPI = {
  onAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;
  onScreenAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
  // Opcionales: si tu signaling ya expone estos, los usamos; si no, no pasa nada.
  onIce?: (cb: (payload: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
  onScreenIce?: (cb: (payload: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
};

// controllers/answersHandlers.ts

type Ctx = {
  isStreamer: boolean;
  signaling: {
    onAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;
    onScreenAnswer: (cb: (payload: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
    onIce?: (cb: (payload: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
    onScreenIce?: (cb: (payload: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
  };
  storeRef: React.MutableRefObject<any>;
  lastOfferPcRef: React.MutableRefObject<RTCPeerConnection | null>;
  screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
  pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
  safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit, pending?: RTCIceCandidateInit[]) => Promise<void>;

  // 🔹 NUEVO: para que el VIEWER aplique la answer de screen
  viewerOutScreenPcRef?: React.MutableRefObject<RTCPeerConnection | null>;

  // 🔹 NUEVO: opcional, por si quieres loguear/validar
  ownerSocketIdRef?: React.MutableRefObject<string | undefined>;
};


export function setupAnswersHandlers(ctx: Ctx) {
  const {
    isStreamer,
    signaling,
    storeRef,
    lastOfferPcRef,
    screenPCsRef,
    pendingScreenCandidatesRef,
    safeAddIce,
    viewerOutScreenPcRef,
  } = ctx;

  // Buffer local para ICE de pantalla del VIEWER,
  // por si llegan antes de que viewerOutScreenPcRef.current exista.
  const pendingViewerScreenIce: RTCIceCandidateInit[] = [];

  /* ─────────────────────────────
   * ANSWER de cámara/mic (ruta "normal")
   * ───────────────────────────── */
  const offAnsMaybe = signaling.onAnswer(async (payload) => {
    const answer = payload?.answer ?? (payload as any);
    const from = (payload as any)?.from as string | undefined;

    if (isStreamer) {
      // STREAMER: o es dirigida (per viewer) o broadcast fallback
      if (from) {
        const pc: RTCPeerConnection | undefined = storeRef.current?.perViewer?.[from];
        if (!pc) {
          console.warn('[[CLT]] (streamer) no PC perViewer para from=%s', from);
          return;
        }
        if (pc.signalingState !== 'have-local-offer') {
          console.warn('[[CLT]] (streamer) ignorando answer tardía/duplicada from=%s, signaling=%s', from, pc.signalingState);
          return;
        }
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('[[CLT]] (streamer) setRemoteDescription OK (dirigida) from=%s', from);
        } catch (e) {
          console.warn('[[CLT]] (streamer) setRemoteDescription error (dirigida) from=%s', from, e);
        }
        return;
      }

      // Fallback broadcast
      const pc = lastOfferPcRef.current;
      if (!pc) return;
      if (pc.signalingState !== 'have-local-offer') {
        console.warn('[[CLT]] (streamer) ignorando broadcast answer; signaling=%s', pc.signalingState);
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[CLT]] (streamer) setRemoteDescription OK (broadcast fallback)');
      } catch (e) {
        console.warn('[[CLT]] (streamer) Fallback ANSWER error', e);
      }
      return;
    } else {
      // VIEWER: normalmente respuesta del streamer a la oferta de cam/mic del viewer
      if (!from) return;
      const pc: RTCPeerConnection | undefined = storeRef.current?.perStreamer?.[from];
      if (!pc) {
        console.warn('[[CLT]] (viewer) no PC perStreamer para from=%s', from);
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[CLT]] (viewer) setRemoteDescription OK (cam/mic) from=%s', from);
      } catch (e) {
        console.warn('[[CLT]] (viewer) setRemoteDescription error (cam/mic) from=%s', from, e);
      }
    }
  });

  /* ─────────────────────────────
   * ANSWER de compartir pantalla
   * ───────────────────────────── */
  const offScreenAnsMaybe = signaling.onScreenAnswer(async ({ answer, from }) => {
    console.log('[[CLT]] onScreenAnswer from=%s type=%s', from ?? '(unknown)', answer?.type);
    if (!from) return;

    if (isStreamer) {
      // STREAMER recibe answer del VIEWER al que le empujó pantalla
      const pc = screenPCsRef.current[from];
      if (!pc) {
        console.warn('[[CLT]] (streamer) screenPC inexistente para from=%s', from);
        return;
      }
      if (pc.signalingState !== 'have-local-offer') {
        console.warn('[[CLT]] (streamer) onScreenAnswer, estado inesperado=%s (from=%s)', pc.signalingState, from);
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[CLT]] (streamer) screen setRemoteDescription OK (from=%s)', from);

        // si teníamos ICE bufferizado para este viewer, aplícalo
        const pend = pendingScreenCandidatesRef.current[from] ?? [];
        if (pend.length) {
          for (const c of pend) await safeAddIce(pc, c);
          pendingScreenCandidatesRef.current[from] = [];
        }
      } catch (e) {
        console.warn('[[CLT]] (streamer) screen setRemoteDescription error (from=%s)', from, e);
      }
    } else {
      // VIEWER recibe answer del OWNER a SU oferta de pantalla
      const pc = viewerOutScreenPcRef?.current ?? null;
      if (!pc) {
        console.warn('[[CLT]] (viewer) viewerOutScreenPcRef vacío; no puedo aplicar answer from=%s', from);
        return;
      }
      if (pc.signalingState !== 'have-local-offer') {
        console.warn('[[CLT]] (viewer) onScreenAnswer estado inesperado=%s', pc.signalingState);
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[[CLT]] (viewer) screen setRemoteDescription OK (from=%s)', from);
        // Aplica ICE que llegó antes de que existiera el PC
        if (pendingViewerScreenIce.length) {
          for (const c of pendingViewerScreenIce.splice(0)) {
            await safeAddIce(pc, c);
          }
        }
      } catch (e) {
        console.warn('[[CLT]] (viewer) screen setRemoteDescription error (from=%s)', from, e);
      }
    }
  });

  /* ─────────────────────────────
   * ICE genérico (cam/mic) — opcional
   * ───────────────────────────── */
  const offIceMaybe =
    typeof signaling.onIce === 'function'
      ? signaling.onIce(async ({ from, candidate }) => {
          if (!from || !candidate) return;

          if (isStreamer) {
            const pc = storeRef.current?.perViewer?.[from];
            if (!pc) return;
            await safeAddIce(pc, candidate);
          } else {
            const pc = storeRef.current?.perStreamer?.[from];
            if (!pc) return;
            await safeAddIce(pc, candidate);
          }
        })
      : undefined;

  /* ─────────────────────────────
   * ICE de screen-share — opcional
   * ───────────────────────────── */
  const offScreenIceMaybe =
    typeof signaling.onScreenIce === 'function'
      ? signaling.onScreenIce(async ({ from, candidate }) => {
          if (!from || !candidate) return;

          if (isStreamer) {
            // STREAMER agrega ICE al PC dedicado con ese viewer; si no existe aún, bufferiza
            let pc = screenPCsRef.current[from];
            if (!pc) {
              const pend = (pendingScreenCandidatesRef.current[from] ||= []);
              pend.push(candidate);
              console.warn('[[CLT]] (streamer) buffering screen ICE from=%s', from);
              return;
            }
            await safeAddIce(pc, candidate, pendingScreenCandidatesRef.current[from]);
          } else {
            // VIEWER agrega ICE a su PC de salida hacia el owner; si no existe, bufferiza localmente
            const pc = viewerOutScreenPcRef?.current ?? null;
            if (!pc) {
              pendingViewerScreenIce.push(candidate);
              console.warn('[[CLT]] (viewer) buffering screen ICE from=%s', from);
              return;
            }
            await safeAddIce(pc, candidate, pendingViewerScreenIce);
          }
        })
      : undefined;

  return () => {
    if (typeof offAnsMaybe === 'function') offAnsMaybe();
    if (typeof offScreenAnsMaybe === 'function') offScreenAnsMaybe();
    if (typeof offIceMaybe === 'function') offIceMaybe();
    if (typeof offScreenIceMaybe === 'function') offScreenIceMaybe();
  };
}

