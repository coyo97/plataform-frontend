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

		pc.onicecandidate = (e) => {
			if (e.candidate) sock.emit('screen-share-ice', { streamId, candidate: e.candidate });
		};

		pc.addTrack(screenTrack, scrStream);
		setScrPC(pc);
		setIsScreenSharing(true);

		// Mostrar localmente (opcional)
		const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (el) {
			el.srcObject = scrStream;
			el.style.display = 'block';
		}

		// Broadcast inicial para los que YA están dentro
		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		sock.emit('screen-share-offer', { streamId, offer }); // ← broadcast sin 'to'

		// Si el usuario detiene compartir desde el navegador
		screenTrack.onended = stopScreenShare;
	};

	//  NUEVO: oferta dirigida para late-joiners
	const sendScreenOfferTo = async (viewerSocketId: string) => {
		const pc = getScrPC();
		if (!pc) return;                            // aún no se comparte pantalla
		if (pc.signalingState !== 'stable') return; // espera a estado estable
		if (pc.getSenders().length === 0) return;   // sin pistas, nada que ofrecer

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
