export const createScreenShare = (deps: {
	streamId : string;
	sock     : import('socket.io-client').Socket;
	getScrPC : () => RTCPeerConnection | null;
	setScrPC : (pc: RTCPeerConnection | null) => void;
	setIsScreenSharing : (b: boolean) => void;
}) => {
	const { streamId, sock, getScrPC, setScrPC, setIsScreenSharing } = deps;

	const startScreenShare = async () => {
		const scrPC = getScrPC();
		if (scrPC) return; // ya está compartiendo

		const scrStream = await (navigator.mediaDevices as any)
		.getDisplayMedia({ video: true });
		const screenTrack = scrStream.getVideoTracks()[0];

		const pc2 = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		pc2.onicecandidate = e => {
			if (e.candidate) sock.emit('screen-share-ice', {
				streamId, candidate: e.candidate,
			});
		};

		pc2.addTrack(screenTrack, scrStream);
		setScrPC(pc2);
		setIsScreenSharing(true);

		const offer = await pc2.createOffer();
		await pc2.setLocalDescription(offer);
		sock.emit('screen-share-offer', { streamId, offer });

		const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (el) el.srcObject = scrStream;

		screenTrack.onended = stopScreenShare;
	};

	const stopScreenShare = () => {
		const scrPC = getScrPC();
		if (!scrPC) return;
		scrPC.getSenders().forEach(s => s.track?.stop());
		scrPC.close();
		setScrPC(null);
		setIsScreenSharing(false);
		sock.emit('stop-screen-share', { streamId });
		const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
		if (el) el.srcObject = null;
	};

	return { startScreenShare, stopScreenShare };
};

