import { EVENTS } from '../../../../../utils/socket/events';

export const createMediaControls = (deps: {
	streamId: string;
	isStreamer: boolean;
	sock: import('socket.io-client').Socket;
	localStream: () => MediaStream | null;
	setCamOn: (b: boolean) => void;
	setMicOn: (b: boolean) => void;
}) => {
	const { streamId, isStreamer, sock, localStream, setCamOn, setMicOn } = deps;

	const toggleCamera = () => {
		const track = localStream()?.getVideoTracks()?.[0];
		if (!track) return;
		track.enabled = !track.enabled;
		setCamOn(track.enabled);
		sock.emit(EVENTS.TOGGLE_CAMERA, { streamId, enabled: track.enabled });
	};

	const toggleMic = () => {
		const track = localStream()?.getAudioTracks()?.[0];
		if (!track) return;
		track.enabled = !track.enabled;
		setMicOn(track.enabled);
		sock.emit(EVENTS.TOGGLE_MIC, { streamId, enabled: track.enabled });
	};

	return { toggleCamera, toggleMic };
};

