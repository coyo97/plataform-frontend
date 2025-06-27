import React, { useRef, useState } from 'react';
import { useStreamConnection } from '../../hooks/useStreamConnection/useStreamConnection';

import Text from '../../../../shared/atoms/typography/Text';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import VideoSurface from './component/VideoSurface';
import StreamerControls from './component/StreamerControls';
import ViewerControls from './component/ViewerControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useAudioToggle } from './hooks/useAudioToggle';

import { Stream } from '../../../../../types/stream';

interface Props {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd: () => void;
	stream?: Stream;
}

const StreamPlayer: React.FC<Props> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
	stream,
}) => {
	/* ─────── conexión RTC / socket ─────── */
	const {
		viewers,
		isScreenSharing,
		startScreenShare,
		stopScreenShare,
		startRecording,
		stopRecording,
		toggleCamera,
		toggleMic,
		isCamOn,
		isMicOn,
		kickViewer,
		handleLeaveStream,
	} = useStreamConnection({ streamId, isStreamer, accessCode, onStreamEnd });

	/* ─────── referencias de vídeo ─────── */
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const screenRef = useRef<HTMLVideoElement>(null);

	/* ─────── hooks utilitarios ─────── */
	const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
	const { enabled: audioEnabled, toggle: toggleAudio } = useAudioToggle(remoteVideoRef);

	/* ─────── viewers toggle ─────── */
	const [showViewers, setShowViewers] = useState(false);

	/* ─────── qué elemento poner en fullscreen ─────── */
	const getFullscreenTarget = () => {
		if (isStreamer) {
			if (isScreenSharing && screenRef.current) return screenRef.current;
			return localVideoRef.current;
		}
		return screenRef.current && screenRef.current.style.display !== 'none'
			? screenRef.current
			: remoteVideoRef.current;
	};

	const handleFullscreen = () => toggleFullscreen(getFullscreenTarget());

	/* ─────── render ─────── */
	return (
		<SmartBox column gap="px8">
			<Text size="lg" weight="bold">{stream?.title ?? `Stream ${streamId}`}</Text>
			{stream?.description && (
				<Text size="sm" style={{ marginBottom: 8 }}>{stream.description}</Text>
			)}

			{isStreamer ? (
				<>
					<Text>Transmitiendo…</Text>
					<VideoSurface ref={localVideoRef} id="localVideo" autoPlay muted playsInline />

					{/* pantalla compartida */}
					<VideoSurface
						ref={screenRef}
						id="screenVideo"
						autoPlay
						playsInline
						hiddenWhenEmpty
						style={{ marginTop: 8 }}
					/>

					<StreamerControls
						isScreenSharing={isScreenSharing}
						isCamOn={isCamOn}
						isMicOn={isMicOn}
						viewers={viewers}
						showViewers={showViewers}
						toggleViewers={() => setShowViewers((p) => !p)}
						startScreen={startScreenShare}
						stopScreen={stopScreenShare}
						toggleCam={toggleCamera}
						toggleMic={toggleMic}
						startRec={startRecording}
						stopRec={stopRecording}
						kickViewer={kickViewer}
						leave={handleLeaveStream}
						fullscreen={handleFullscreen}
						isFullscreen={isFullscreen}
					/>
				</>
			) : (
				<>
					<Text>Viendo el stream…</Text>
					<VideoSurface ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline />

					{/* si el streamer comparte pantalla */}
					<VideoSurface
						ref={screenRef}
						id="screenVideo"
						autoPlay
						playsInline
						hiddenWhenEmpty
						style={{ marginTop: 8 }}
					/>

					<ViewerControls
						audioEnabled={audioEnabled}
						toggleAudio={toggleAudio}
						fullscreen={handleFullscreen}
						isFullscreen={isFullscreen}
						leave={handleLeaveStream}
					/>
				</>
			)}
		</SmartBox>
	);
};

export default StreamPlayer;

