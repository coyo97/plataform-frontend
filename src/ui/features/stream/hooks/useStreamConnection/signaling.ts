// src/ui/features/stream/hooks/useStreamConnection/signaling.ts
import { EVENTS } from '../../../../../utils/socket/events';
import { STUN_SERVERS } from './constants';

export const registerSignaling = (deps: {
	/* refs y helpers inyectados desde useStreamConnection */
	sock:   import('socket.io-client').Socket;
	socket: import('socket.io-client').Socket;
	isStreamer: boolean;
	streamId  : string;

	pcMain : RTCPeerConnection;                               // cámara principal del streamer
	pcMap  : React.MutableRefObject<Record<string, RTCPeerConnection>>;
	viewerPcMap: React.MutableRefObject<Record<string, RTCPeerConnection>>;

	pc2Ref : React.MutableRefObject<RTCPeerConnection | null>; // pantalla en viewer
	scrPC  : React.MutableRefObject<RTCPeerConnection | null>; // pantalla en streamer

	pendingCandidates: React.MutableRefObject<RTCIceCandidateInit[]>;
	pendingViewers   : React.MutableRefObject<string[]>;

	setViewers:          (v: any) => void;
	setScrPC:            (pc: RTCPeerConnection | null) => void;
	setIsScreenSharing:  (b: boolean) => void;
	handleLeaveStream:   () => void;
	log: (...a: any[]) => void;
}) => {
	const {
		sock, socket, isStreamer, streamId,
		pcMain, pcMap, viewerPcMap,
		pc2Ref, scrPC,
		pendingCandidates, pendingViewers,
		setViewers, setScrPC, setIsScreenSharing,
		handleLeaveStream, log,
	} = deps;

	/* ════════════════════════════════ 1. ANSWER ════════════════════════════════ */
	sock.on(EVENTS.ANSWER, async (answer) => {
		if (isStreamer && pcMain.signalingState === 'have-remote-offer') {
			await pcMain.setRemoteDescription(new RTCSessionDescription(answer));
		}
	});

	/* ═══════════════════════════════ 2. ICE global ════════════════════════════ */
	sock.on('ice-candidate', async ({ from, candidate }) => {
		const target = isStreamer ? pcMap.current[from] : viewerPcMap.current[from];
		if (target) {
			await target.addIceCandidate(new RTCIceCandidate(candidate));
		}
	});

	/* ═══════════════════════ 3. Kicked & stream-error ════════════════════════ */
	socket.on('kicked', handleLeaveStream);
	socket.on('stream-error', ({ message }) => {
		if (message.toLowerCase().includes('expulsado')) handleLeaveStream();
	});

	/* ═══════════════════════ 4. Lista de viewers ═════════════════════════════ */
	sock.on(EVENTS.UPDATE_VIEWERS, ({ viewers }) => setViewers(viewers));

	/* ═══════════════ 5A. (VIEWER) Cámara del streamer  ════════════════════════ */
	if (!isStreamer) {
		sock.on('offer', async ({ offer, from }) => {
			const pcFromStreamer = new RTCPeerConnection({ iceServers: STUN_SERVERS });
			viewerPcMap.current[from] = pcFromStreamer;

			pcFromStreamer.ontrack = ev => {
				const cam = document.getElementById('remoteVideo') as HTMLVideoElement | null;
				if (cam && cam.srcObject !== ev.streams[0]) {
					cam.srcObject = ev.streams[0];
					cam.onloadedmetadata = () => cam.play().catch(console.error);
				}
			};

			pcFromStreamer.onicecandidate = e => {
				if (e.candidate)
					socket.emit('ice-candidate', { streamId, to: from, candidate: e.candidate });
			};

			await pcFromStreamer.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await pcFromStreamer.createAnswer();
			await pcFromStreamer.setLocalDescription(answer);
			socket.emit('answer', { streamId, to: from, answer });
		});
	}

	/* ═══════════════ 5B. (VIEWER) Pantalla compartida ════════════════════════ */
			sock.on('screen-share-offer', async ({ offer }) => {
				// 1️⃣  crea-o-recrea la PC si no existe o está cerrada
				let pc = pc2Ref.current;
				if (!pc || pc.signalingState === 'closed') {
					pc = new RTCPeerConnection({
						iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
					});
					pc2Ref.current = pc;

					// ontrack: asigna stream y lo muestra
					pc.ontrack = ev => {
						const video = document.getElementById('screenVideo') as HTMLVideoElement | null;
						if (video) {
							video.srcObject = ev.streams[0];
							video.style.display = 'block';            //  asegura visibilidad inmediata
						}
					};

					// reléa ICE
					pc.onicecandidate = e => {
						if (e.candidate)
							sock.emit('screen-share-ice', { streamId, candidate: e.candidate });
					};
				}  /*  Evita setRemoteDescription duplicado */
				if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
					console.log('[viewer] ignorando oferta duplicada; state =', pc.signalingState);
					return;
				}


				//   procesa la oferta
				await pc.setRemoteDescription(new RTCSessionDescription(offer));
				/* Sólo respondemos si todavía no enviamos answer */
				if (pc.signalingState === 'have-remote-offer') {
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					sock.emit('screen-share-answer', { streamId, answer });
				}
			});

	sock.on('screen-share-ice', async ({ candidate }) => {
		try { await pc2Ref.current?.addIceCandidate(new RTCIceCandidate(candidate)); }
		catch (err) { console.error('addIce (viewer) err', err); }
	});

	sock.on('stop-screen-share', () => {
		pc2Ref.current?.close();
		pc2Ref.current = null;
		const vid = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (vid) { vid.srcObject = null; vid.style.display = 'none'; }
	});

	/* ═══════════════ 6. (STREAMER) Pantalla solicitada por viewer ═════════════ */
	const sendScreenOfferTo = async (viewerSocketId: string) => {
		if (!scrPC.current) return;
		if (scrPC.current.getSenders().length === 0) {
			log('scrPC sin pistas; se omite oferta');
			return;
		}
		const off = await scrPC.current.createOffer();
		await scrPC.current.setLocalDescription(off);
		sock.emit('screen-share-offer', { streamId, offer: off, to: viewerSocketId });
	};

	sock.on('request-screen-share', ({ viewerSocketId }) => {
		if (!scrPC.current || scrPC.current.signalingState === 'closed') {
			pendingViewers.current.push(viewerSocketId);
			return;
		}
		if (scrPC.current.signalingState !== 'stable') {
			pendingViewers.current.push(viewerSocketId);
			return;
		}
		sendScreenOfferTo(viewerSocketId);
	});

	if (scrPC.current) {
		scrPC.current.onsignalingstatechange = () => {
			if (scrPC.current!.signalingState === 'stable' &&
				pendingViewers.current.length > 0) {
				const q = pendingViewers.current.splice(0);
			q.forEach(sendScreenOfferTo);
			}
		};
	}

	sock.on('screen-share-answer', async ({ answer }) => {
		if (!scrPC.current) return;
		if (scrPC.current.signalingState === 'have-local-offer') {
			await scrPC.current.setRemoteDescription(new RTCSessionDescription(answer));
			for (const c of pendingCandidates.current)
				await scrPC.current.addIceCandidate(new RTCIceCandidate(c));
			pendingCandidates.current = [];
		}
	});

	sock.on('screen-share-ice', async ({ candidate }) => {
		if (scrPC.current)
			await scrPC.current.addIceCandidate(new RTCIceCandidate(candidate));
	});

	/* ═══════════════ 7. cleanup ═══════════════ */
	return () => sock.off();               // quita todos los listeners creados
};

