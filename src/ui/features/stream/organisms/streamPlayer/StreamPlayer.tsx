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

	/* ─────── helpers de UI ─────── */
	const teacherName =
		(stream as any)?.author?.name ||
		(stream as any)?.author?.fullName ||
		(stream as any)?.ownerName ||
		(stream as any)?.createdBy?.name ||
		'Docente';

	const liveChipStyle: React.CSSProperties = {
		display: 'inline-flex',
		alignItems: 'center',
		gap: 6,
		padding: '2px 8px',
		borderRadius: 999,
		fontSize: 12,
		fontWeight: 700,
		background: '#E53935', // rojo vivo
		color: '#fff',
		letterSpacing: 0.2,
	};

	const substateStyle: React.CSSProperties = {
		display: 'inline-flex',
		alignItems: 'center',
		gap: 6,
		fontSize: 13,
		fontWeight: 600,
		opacity: 0.9,
		animation: 'blinkDot 1.6s ease-in-out infinite',
	};

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
			{/* keyframes locales para el subestado */}
			<style>
				{`
					@keyframes blinkDot {
						0% { opacity: 1; }
						50% { opacity: .55; }
						100% { opacity: 1; }
					}
					`}
			</style>

			{/* Header jerárquico del player */}
			<SmartBox row between gap="px8">
				<SmartBox row >
					<span style={liveChipStyle} aria-label="Transmisión en vivo">
						EN VIVO
					</span>
					<Text size="lg" weight="bold" as="h1">
						🎥 {stream?.title ?? `Transmisión en vivo: `}
					</Text>
				</SmartBox>

				{/* Línea secundaria: Profesor | espectadores */}
				<SmartBox row gap="px6">
					<Text size="sm">
						<strong>Profesor:</strong> {teacherName}
					</Text>
					<Text size="sm" aria-label="Conteo de espectadores">
						| {viewers?.length ?? 0}{' '}
						{(viewers?.length ?? 0) === 1 ? 'espectador' : 'espectadores'}
					</Text>
				</SmartBox>
			</SmartBox>

			{/* Subestado animado */}
			<Text as="p" style={substateStyle}>
				<span role="img" aria-hidden="true">📡</span> Transmitiendo…
			</Text>

			{stream?.description && (
				<Text size="sm" style={{ marginTop: 4 }}>{stream.description}</Text>
			)}

			{isStreamer ? (
				<>
					<SmartBox
						className="video-stage"
						style={{ position: 'relative', width: '100%' }}
					>
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
					</SmartBox>
				</>
			) : (
				<>
					<SmartBox
						className="video-stage"
						style={{ position: 'relative', width: '100%' }}
					>
						<VideoSurface ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline />
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
					</SmartBox>
				</>
			)}
		</SmartBox>
	);
};

export default StreamPlayer;

