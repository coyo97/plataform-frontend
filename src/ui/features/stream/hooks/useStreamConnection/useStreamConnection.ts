import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../../../shared/hooks/useSocket';
import { EVENTS } from '../../../../../utils/socket/events';
import { Viewer, UseStreamConnectionProps } from './types';

import { buildContext } from './deps';

// controladores
import { setupPublisherCam } from './controllers/publisherCam';
import { setupPerViewerCam } from './controllers/perViewerCam';
import { setupAnswersHandlers } from './controllers/answersHandlers';
import { setupIceHandlers } from './controllers/iceHandlers';
import { setupScreenSender } from './controllers/screenSender';
import { setupScreenViewer } from './controllers/screenViewer';

export const useStreamConnection = ({
  streamId,
  isStreamer,
  accessCode,
  onStreamEnd,
}: UseStreamConnectionProps) => {
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCamOn, setCamOn] = useState(true);
  const [isMicOn, setMicOn] = useState(true);

  const sock = useSocket();

  const {
    signaling,
    storeRef,
    localStreamRef,
    viewerMicRef,
    lastOfferPcRef,
    screenPCsRef,
    pendingScreenCandidatesRef,
    startRecording,
    stopRecording,
    toggleCamera,
    toggleMic,
    startScreenShare,
    stopScreenShare,
    handleLeaveStream,
    stopLocalMedia,
    sendDirectScreenOfferTo,
    clearRemoteScreen,
    safeAddIce,

    // NUEVO: acciones del viewer expuestas por buildContext
    viewerStartCam,
    viewerStopCam,
    viewerStartScreenShare,
    viewerStopScreenShare,
	  viewerOutScreenPcRef,
  ownerSocketIdRef,
  } = buildContext({
    streamId,
    isStreamer,
    accessCode,
    onStreamEnd,
    sock,
    setIsScreenSharing,
    setCamOn,
    setMicOn,
  });

  // Estrechamos el tipo localmente para encajar con los controladores (sin tocar tu implementación real)
  const sig = signaling as unknown as {
    emitIce: (c: RTCIceCandidateInit, to?: string) => void;
    emitOffer: (o: RTCSessionDescriptionInit, to?: string) => void;
    onRequestOffer: (cb: (p: { viewerSocketId: string }) => void) => unknown;

    onOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
    onAnswer: (cb: (p: { answer: RTCSessionDescriptionInit; from?: string }) => void) => unknown;

    onIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;

    // pantalla
    onRequestScreenShare: (cb: (p: { viewerSocketId: string }) => void) => unknown;
    onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
    onScreenAnswer: (cb: (p: { answer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
    onScreenIce: (cb: (p: { from: string; candidate: RTCIceCandidateInit }) => void) => unknown;
    emitScreenIce: (c: RTCIceCandidateInit, to: string) => void;
    emitScreenAnswer: (a: RTCSessionDescriptionInit, to: string) => void;
    onStopScreenShare?: (cb: () => void) => unknown;

    // estado / varios
    onCurrentStreamState?: (cb: (p: {
      isSharingScreen?: boolean;
      isStreamerMuted?: boolean;
      viewersCount?: number;
      hasCamera?: boolean;
      hasMic?: boolean;
    }) => void) => unknown;

    onUpdateViewers: (cb: (p: { viewers: Viewer[] }) => void) => unknown;
    onStreamEnded: (cb: () => void) => unknown;
    onKicked: (cb: () => void) => unknown;
    onStreamError: (cb: (p: { message: string }) => void) => unknown;

    // acciones directas
    joinStream: (accessCode?: string) => unknown;
    leaveStream: () => unknown;
    requestScreenShare: () => void;
    offAll: () => unknown;
  };

  const kicked = useRef(false);

  useEffect(() => {
    console.log('[[CLT]] joinStream streamId=%s isStreamer=%s', streamId, isStreamer);
    sig.joinStream(accessCode);

    // Snapshot del estado del stream al unirse
    sig.onCurrentStreamState?.(({ isSharingScreen, isStreamerMuted, viewersCount, hasCamera, hasMic }) => {
      if (typeof isSharingScreen === 'boolean') setIsScreenSharing(isSharingScreen);
      if (typeof hasCamera === 'boolean') setCamOn(hasCamera);
      if (typeof hasMic === 'boolean') setMicOn(hasMic);
      console.log(
        '[[STATE]] snapshot -> screen=%s cam=%s mic=%s viewers=%s muted=%s',
        isSharingScreen, hasCamera, hasMic, viewersCount, isStreamerMuted
      );
    });

    // ====== Controladores (registran handlers en signaling y usan el contexto) ======
    // Streamer: media local + broadcast inicial + ofertas dirigidas de cam/mic
    const publisherCleanup = setupPublisherCam({
      isStreamer,
      signaling: sig,
      storeRef,
      localStreamRef,
      lastOfferPcRef,
    });

    // Viewer: recepción de cam/mic, attach mic del viewer
    const perViewerCleanup = setupPerViewerCam({
      isStreamer,
      signaling: sig,
      storeRef,
      viewerMicRef,
    });

    // Respuestas (answers) cam/mic y screen
    const answersCleanup = setupAnswersHandlers({
      isStreamer,
      signaling: sig,
      storeRef,
      lastOfferPcRef,
      screenPCsRef,
      pendingScreenCandidatesRef,
      safeAddIce,
	   viewerOutScreenPcRef,   // <- del buildContext
  ownerSocketIdRef,       // <- del buildContext (opcional, por logging / validación)
    });

    // ICE handlers (cam/mic y screen)
    const iceCleanup = setupIceHandlers({
      isStreamer,
      signaling: sig,
      storeRef,
      screenPCsRef,
      pendingScreenCandidatesRef,
      safeAddIce,
    });

    // Streamer: envío directo de pantalla por viewer + stop-screen-share
    const screenSenderCleanup = setupScreenSender({
      isStreamer,
      signaling: sig,
      screenPCsRef,
      pendingScreenCandidatesRef,
      sendDirectScreenOfferTo,
    });

    // Viewer: recepción de oferta de pantalla y render
    const screenViewerCleanup = setupScreenViewer({
      isStreamer,
      signaling: sig,
      storeRef,
      clearRemoteScreen,
    });

    // Lista de viewers
    sig.onUpdateViewers(({ viewers }) => {
      console.log('[[CLT]] update-viewers size=%d', viewers?.length ?? 0);
      setViewers(viewers);
    });

    sig.onStreamEnded(() => {
      console.log('[[CLT]] stream-ended → cleanup');
      stopLocalMedia();
      onStreamEnd?.();
    });

    sig.onKicked(() => {
      console.warn('[[CLT]] kicked → leave');
      kicked.current = true;
      handleLeaveStream();
    });

    sig.onStreamError(({ message }) => {
      console.warn('[[CLT]] stream-error:', message);
      if (message.toLowerCase().includes('expulsado')) {
        kicked.current = true;
        handleLeaveStream();
      }
    });

    // Viewer: solicitar pantalla al entrar y al reconectar
    if (!isStreamer) {
      console.log('[[VIEWER]] request-screen-share (initial)');
      sig.requestScreenShare();
      sock.on('connect', () => {
        console.log('[[VIEWER]] request-screen-share (reconnect)');
        sig.requestScreenShare();
      });
    }

    return () => {
      console.log('[[CLT]] cleanup useStreamConnection');
      sig.leaveStream();
      sig.offAll();
      stopLocalMedia();
      // cerrar tracks locales
      try { localStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
      try { viewerMicRef.current?.getTracks().forEach(t => t.stop()); } catch {}

      // cerrar PCs en store
      try { storeRef.current.publisher?.close(); } catch {}
      storeRef.current.publisher = undefined;
      try { storeRef.current.screenPublisher?.close(); } catch {}
      storeRef.current.screenPublisher = undefined;

      Object.values(storeRef.current.perViewer).forEach((pc: RTCPeerConnection) => { try { pc.close(); } catch {} });
      storeRef.current.perViewer = {};
      Object.values(storeRef.current.perStreamer).forEach((pc: RTCPeerConnection) => { try { pc.close(); } catch {} });
      storeRef.current.perStreamer = {};

      // cerrar PCs de pantalla por viewer
      Object.values(screenPCsRef.current).forEach((pc: RTCPeerConnection) => { try { pc.close(); } catch {} });
      screenPCsRef.current = {};
      pendingScreenCandidatesRef.current = {};

      // unbinds
      sock.off('connect');
      publisherCleanup();
      perViewerCleanup();
      answersCleanup();
      iceCleanup();
      screenSenderCleanup();
      screenViewerCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, isStreamer]);

  return {
    viewers,
    isScreenSharing,
    isCamOn,
    isMicOn,

    startScreenShare,
    stopScreenShare,
    startRecording,
    stopRecording,
    toggleCamera,
    toggleMic,

    // NUEVO: expone acciones para el viewer
    viewerStartCam,
    viewerStopCam,
    viewerStartScreenShare,
    viewerStopScreenShare,

    kickViewer: (id: string) => sock.emit(EVENTS.KICK_VIEWER, { streamId, viewerId: id }),
    handleLeaveStream,
    wasKicked: kicked.current,
  };
};

