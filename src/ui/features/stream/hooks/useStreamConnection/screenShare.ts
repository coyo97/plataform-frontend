 // src/ui/features/stream/hooks/useStreamConnection/screenShare.ts
import { STUN_SERVERS } from './constants';

export const createScreenShare = (deps: {
	streamId : string;
	sock     : import('socket.io-client').Socket;
	getScrPC : () => RTCPeerConnection | null;
	setScrPC : (pc: RTCPeerConnection | null) => void;
	setIsScreenSharing : (b: boolean) => void;
}) => {
	const { streamId, sock, getScrPC, setScrPC, setIsScreenSharing } = deps;

	const startScreenShare = async () => {
		const existing = getScrPC();
		if (existing) return; // ya está compartiendo

		const scrStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
		const screenTrack = scrStream.getVideoTracks()[0];

		const pc = new RTCPeerConnection({
			iceServers: STUN_SERVERS ?? [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		// Este PC es solo el "publisher" local de pantalla,
		// la negociación real con viewers se hace con sendDirectScreenOfferTo (deps.ts)
		pc.onicecandidate = (e) => {
			if (e.candidate) {
				// Si quieres, aquí incluso podrías no emitir nada,
				// porque este PC no tiene peer remoto.
				sock.emit('screen-share-ice', { streamId, candidate: e.candidate });
			}
		};

		pc.addTrack(screenTrack, scrStream);
		setScrPC(pc);
		setIsScreenSharing(true);

		// Mostrar localmente (preview del host)
		const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (el) {
			el.srcObject = scrStream;
			el.style.display = 'block';
		}

		// const offer = await pc.createOffer();
		// await pc.setLocalDescription(offer);
		// sock.emit('screen-share-offer', { streamId, offer });

		// Si el usuario detiene compartir desde el navegador
		screenTrack.onended = stopScreenShare;
	};

	const sendScreenOfferTo = async (viewerSocketId: string) => {
		const pc = getScrPC();
		if (!pc) return;                            
		if (pc.signalingState !== 'stable') return;
		if (pc.getSenders().length === 0) return; 

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		sock.emit('screen-share-offer', { streamId, offer, to: viewerSocketId }); // ← dirigida
	};

	const stopScreenShare = () => {
		const pc = getScrPC();
		if (!pc) return;

		pc.getSenders().forEach((s) => s.track?.stop());
		try { pc.close(); } catch {}
		setScrPC(null);
		setIsScreenSharing(false);

		sock.emit('stop-screen-share', { streamId });

		const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (el) {
			el.srcObject = null;
			el.removeAttribute('src');
			el.load();
			el.style.display = 'none';
		}
	};

	return { startScreenShare, stopScreenShare, sendScreenOfferTo };
};
