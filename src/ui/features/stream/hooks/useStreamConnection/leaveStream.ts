export const createLeaveHandlers = (deps: {
	streamId: string;
	socket  : import('socket.io-client').Socket;
	onStreamEnd?: () => void;
	localStreamRef: React.MutableRefObject<MediaStream | null>;
	peerRef : React.MutableRefObject<RTCPeerConnection | null>;
	screenRef: React.MutableRefObject<RTCPeerConnection | null>;
}) => {
	const { streamId, socket, onStreamEnd, localStreamRef, peerRef, screenRef } = deps;

	const stopLocalMedia = () => {
		localStreamRef.current?.getTracks().forEach(t => t.stop());
		peerRef.current?.getSenders().forEach(s => s.track?.stop());
		screenRef.current?.getSenders().forEach(s => s.track?.stop());
		peerRef.current?.close();
		screenRef.current?.close();
		['localVideo','remoteVideo','screenVideo'].forEach(id=>{
			const v=document.getElementById(id) as HTMLVideoElement|null;
			if (v) v.srcObject = null;
		});
	};

	const leaveStream = () => {
		stopLocalMedia();
		socket.emit('leave-stream', { streamId });
		localStorage.removeItem('joinedStreamId');
		localStorage.removeItem('isViewer');
		localStorage.removeItem('accessCode');
		onStreamEnd?.();
	};

	return { leaveStream, stopLocalMedia };
};

