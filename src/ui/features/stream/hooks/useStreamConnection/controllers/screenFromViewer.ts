// src/ui/features/stream/hooks/useStreamConnection/controllers/screenFromViewer.ts
import { STUN_SERVERS } from '../constants';
import { createPeerConnection } from '../webrtc/peerFactory';
import { attachStreamToVideo } from '../webrtc/mediaAttach';

type Ctx = {
	isStreamer: boolean;
	signaling: {
		onScreenOffer: (cb: (p: { offer: RTCSessionDescriptionInit; from: string }) => void) => unknown;
		emitScreenIce: (cand: RTCIceCandidateInit, to: string) => void;
		emitScreenAnswer: (ans: RTCSessionDescriptionInit, to: string) => void;

		// Opcionales; si tu signaling las expone las usamos para reenviar pantallas a recién llegados
		onViewerList?: (cb: (p: { viewers: string[] }) => void) => unknown;
		onViewerJoined?: (cb: (p: { viewerSocketId: string }) => void) => unknown;

		// Opcional: si emites stop-screen-share desde el viewer
		onStopScreenShareFromViewer?: (cb: (p: { from: string }) => void) => unknown;
	};
	storeRef: React.MutableRefObject<any>;

	//  Necesarios para que el ICE del host funcione al recibir pantallas de viewers
	screenPCsRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	pendingScreenCandidatesRef: React.MutableRefObject<Record<string, RTCIceCandidateInit[]>>;
	safeAddIce: (pc: RTCPeerConnection, cand: RTCIceCandidateInit) => Promise<void>;

	//  Función expuesta por buildContext (deps.ts): relay de la pantalla de un viewer A hacia un viewer B
	relayViewerScreenOfferTo: (ownerViewerId: string, targetViewerId: string) => Promise<void>;
};

function ensureScreenVideoElement(id: string) {
	let el = document.getElementById(id) as HTMLVideoElement | null;
	if (el) return el;

	let grid = document.getElementById('screenGrid');
	if (!grid) {
		grid = document.createElement('div');
		grid.id = 'screenGrid';
		Object.assign(grid.style, {
			display: 'grid',
			gap: '12px',
			gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
			width: '100%',
			marginTop: '8px',
		} as CSSStyleDeclaration);
		const stage = document.querySelector('.video-stage') as HTMLElement | null;
		(stage ?? document.body).appendChild(grid);
	}

	el = document.createElement('video');
	el.id = id;
	el.autoplay = true;
	el.playsInline = true;
	el.controls = false;
	Object.assign(el.style, {
		width: '100%',
		height: '180px',
		borderRadius: '10px',
		objectFit: 'cover',
		background: '#000',
		boxShadow: '0 8px 24px rgba(0,0,0,.25)',
	} as CSSStyleDeclaration);

	(grid as HTMLElement).appendChild(el);
	return el;
}

export function setupScreenFromViewer(ctx: Ctx) {
	const {
		isStreamer,
		signaling,
		storeRef,
		screenPCsRef,
		pendingScreenCandidatesRef,
		safeAddIce,
		relayViewerScreenOfferTo,
	} = ctx;

	if (!isStreamer) return () => {};

	// Asegura estructuras
	storeRef.current.perViewerScreen ||= {};
	storeRef.current.viewerScreens ||= {};
	storeRef.current.perViewer ||= {};

	// 1) OWNER atiende ofertas de pantalla de VIEWERS (A → Owner)
	const offScreenOffer = signaling.onScreenOffer(async ({ offer, from }) => {
		// PC dedicado por viewer que comparte pantalla
		let pc: RTCPeerConnection | undefined = storeRef.current.perViewerScreen[from];

		const makePc = () =>
			createPeerConnection({
			iceServers: STUN_SERVERS,
			onIce: (e) => e.candidate && signaling.emitScreenIce(e.candidate, from),
			onTrack: (ev) => {
				const [ms] = ev.streams;
				const vidId = `screenVideo-${from}`;
				ensureScreenVideoElement(vidId);
				attachStreamToVideo(vidId, ms);

				const v = document.getElementById(vidId) as HTMLVideoElement | null;
				if (v) {
					v.style.display = 'block';
					v.muted = false;
					v.playsInline = true;
					v.play?.().catch(() => {});
				}

				// Guarda el stream para poder relayar a otros viewers
				storeRef.current.viewerScreens[from] = ms;

				// Limpieza al terminar el track
				const track = ms.getVideoTracks()[0];
				if (track) {
					track.onended = () => {
						try { delete storeRef.current.viewerScreens[from]; } catch {}
						const el = document.getElementById(vidId) as HTMLVideoElement | null;
						if (el) {
							el.srcObject = null;
							el.removeAttribute('src');
							el.load();
							el.style.display = 'none';
						}
					};
				}

				// RELAY inmediato: envía la pantalla de "from" a cada viewer conectado (excepto "from")
				const allViewers = Object.keys(storeRef.current.perViewer || {});
				const targets = allViewers.filter((sockId) => sockId !== from);
				if (targets.length) {
					console.log('[[RELAY]] viewer=%s → relay a %d viewers', from, targets.length);
					targets.forEach(async (target) => {
						try {
							await relayViewerScreenOfferTo(from, target);
						} catch (e) {
							console.warn('[[RELAY]] error relay a %s (owner=%s)', target, from, e);
						}
					});
				}
			},
		});

		if (!pc || pc.signalingState === 'closed' || pc.connectionState === 'failed') {
			pc = makePc();
			storeRef.current.perViewerScreen[from] = pc;
		}

		//  Mapea para que iceHandlers agregue ICE al PC correcto
		screenPCsRef.current[from] = pc;

		// Aplica la oferta del viewer y responde
		await pc.setRemoteDescription(new RTCSessionDescription(offer));
		const ans = await pc.createAnswer();
		await pc.setLocalDescription(ans);
		signaling.emitScreenAnswer(ans, from);

		//  Drenar ICE pendientes que llegaron antes de crear/mapear el PC
		const pend = pendingScreenCandidatesRef.current[from];
		if (pend?.length) {
			console.log('[[HOST][DRAIN]] ICE pendientes=%d (from viewer=%s)', pend.length, from);
			for (const c of pend) {
				try { await safeAddIce(pc, c); } catch (e) {
					console.warn('[[HOST][DRAIN]] addIceCandidate fallo (from=%s)', from, e);
				}
			}
			pendingScreenCandidatesRef.current[from] = [];
		}

		// Limpieza por estado de conexión
		// Limpieza por estado de conexión
		if (!pc) return;                    // <- guarda defensiva
		const pcLive = pc;                  // <- copia estable para el closure

		pcLive.onconnectionstatechange = () => {
			const st = pcLive.connectionState;
			if (st === 'failed' || st === 'disconnected' || st === 'closed') {
				if (storeRef.current.perViewerScreen?.[from] === pcLive) {
					delete storeRef.current.perViewerScreen[from];
				}
			}
		};

	});

	// 2) Cuando llega un NUEVO viewer, relaya TODAS las pantallas activas
	let offViewerList: unknown;
	if (typeof signaling.onViewerList === 'function') {
		offViewerList = signaling.onViewerList(async ({ viewers }) => {
			const activeOwners = Object.keys(storeRef.current.viewerScreens || {});
			if (!activeOwners.length || !Array.isArray(viewers) || !viewers.length) return;

			for (const v of viewers) {
				for (const ownerViewerId of activeOwners) {
					if (v === ownerViewerId) continue; // no auto-relay al originador
					try {
						await relayViewerScreenOfferTo(ownerViewerId, v);
					} catch (e) {
						console.warn('[[RELAY]] error relay (onViewerList) owner=%s -> to=%s', ownerViewerId, v, e);
					}
				}
			}
		});
	}

	let offViewerJoined: unknown;
	if (typeof signaling.onViewerJoined === 'function') {
		offViewerJoined = signaling.onViewerJoined(async ({ viewerSocketId }) => {
			const activeOwners = Object.keys(storeRef.current.viewerScreens || {});
			if (!activeOwners.length) return;

			for (const ownerViewerId of activeOwners) {
				if (viewerSocketId === ownerViewerId) continue;
				try {
					await relayViewerScreenOfferTo(ownerViewerId, viewerSocketId);
				} catch (e) {
					console.warn('[[RELAY]] error relay (onViewerJoined) owner=%s -> to=%s', ownerViewerId, viewerSocketId, e);
				}
			}
		});
	}

	// 3) Limpieza si el viewer deja de compartir (opcional si tu backend lo emite)
	let offStopFromViewer: unknown;
	if (typeof signaling.onStopScreenShareFromViewer === 'function') {
		offStopFromViewer = signaling.onStopScreenShareFromViewer(({ from }) => {
			try { delete storeRef.current.viewerScreens[from]; } catch {}
			const vidId = `screenVideo-${from}`;
			const el = document.getElementById(vidId) as HTMLVideoElement | null;
			if (el) {
				el.srcObject = null;
				el.removeAttribute('src');
				el.load();
				el.style.display = 'none';
			}
			const pc = storeRef.current.perViewerScreen?.[from];
			if (pc) {
				try { pc.close(); } catch {}
				delete storeRef.current.perViewerScreen[from];
			}
			// Limpia también el mapping de ICE
			if (screenPCsRef.current[from]) delete screenPCsRef.current[from];
			pendingScreenCandidatesRef.current[from] = [];
		});
	}

	return () => {
		try { (offScreenOffer as any)?.(); } catch {}
		try { (offViewerList as any)?.(); } catch {}
		try { (offViewerJoined as any)?.(); } catch {}
		try { (offStopFromViewer as any)?.(); } catch {}
	};
}

