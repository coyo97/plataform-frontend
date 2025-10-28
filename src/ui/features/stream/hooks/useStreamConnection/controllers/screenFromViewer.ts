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
	};
	storeRef: React.MutableRefObject<any>;
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

	grid.appendChild(el);
	return el;
}

export function setupScreenFromViewer(ctx: Ctx) {
	const { isStreamer, signaling, storeRef } = ctx;
	if (!isStreamer) return () => {};

	const off = signaling.onScreenOffer(async ({ offer, from }) => {
		let pc: RTCPeerConnection | undefined = storeRef.current.perViewerScreen?.[from];
		if (!pc || pc.signalingState === 'closed') {
			pc = createPeerConnection({
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
						v.play?.().catch(() => {});
					}

					// Guarda el stream para relay
					if (!storeRef.current.viewerScreens) storeRef.current.viewerScreens = {};
					storeRef.current.viewerScreens[from] = ms;

					// 🔔 Notifica al hook que hay NUEVA pantalla desde "from"
					window.dispatchEvent(
						new CustomEvent('viewer-screen-added', { detail: { from } })
					);
				},
			});
			if (!storeRef.current.perViewerScreen) storeRef.current.perViewerScreen = {};
			storeRef.current.perViewerScreen[from] = pc;
		}

		await pc.setRemoteDescription(new RTCSessionDescription(offer));
		const ans = await pc.createAnswer();
		await pc.setLocalDescription(ans);
		signaling.emitScreenAnswer(ans, from);
	});

	return () => {
		if (typeof off === 'function') off();
	};
}

