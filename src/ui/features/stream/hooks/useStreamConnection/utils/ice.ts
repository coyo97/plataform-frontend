// src/ui/features/stream/hooks/useStreamConnection/utils/ice.ts
export async function safeAddIce(pc: RTCPeerConnection, candidate: RTCIceCandidateInit) {
  try {
    if (!pc.remoteDescription) {
      // encola en el propio objeto pc
      const q: RTCIceCandidateInit[] = (pc as any).__iceQ || ((pc as any).__iceQ = []);
      q.push(candidate);
      return;
    }
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (e) {
    console.warn('safeAddIce error', e);
  }
}

export async function flushQueuedIce(pc: RTCPeerConnection) {
  const q: RTCIceCandidateInit[] | undefined = (pc as any).__iceQ;
  if (!q || q.length === 0) return;
  for (const c of q.splice(0)) {
    try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { console.warn('flush ICE err', e); }
  }
}

