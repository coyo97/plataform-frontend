import React, { useRef, useState } from 'react';
import { useStreamConnection } from '../../hooks/useStreamConnection/useStreamConnection';

import SmartBox from '../../../../shared/atoms/box/SmartBox';
import StreamerControls from './component/StreamerControls';
import ViewerControls from './component/ViewerControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useAudioToggle } from './hooks/useAudioToggle';

import { Stream } from '../../../../../types/stream';
import { attachLocalPreview, clearVideoEl } from '../../hooks/useStreamConnection/webrtc/mediaAttach';
import { PLAYER_GLOBAL_CSS } from './StreamPlayer.styles';

import StreamPlayerHeader from './component/StreamPlayerHeader';
import StreamMainView from './component/StreamMainView';
import HostBadge from './component/HostBadge';
import ScreenShareCarousel from './component/ScreenShareCarousel';

interface Props {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd: () => void;
	stream?: Stream;
	focusMode?: boolean;
}

const StreamPlayer: React.FC<Props> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
	stream,
	focusMode = false,
}) => {
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

		viewerStartCam,
		viewerStopCam,
		viewerStartScreenShare,
		viewerStopScreenShare,
		endStream,
	} = useStreamConnection({ streamId, isStreamer, accessCode, onStreamEnd });

	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const screenRef = useRef<HTMLVideoElement>(null);

	const viewerLocalPreviewRef = useRef<HTMLVideoElement>(null);

	const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
	const { enabled: audioEnabled, toggle: toggleAudio } = useAudioToggle(remoteVideoRef);

	const [showViewers, setShowViewers] = useState(false);
	const [viewerCamOn, setViewerCamOn] = useState(false);
	const [viewerScreenOn, setViewerScreenOn] = useState(false);

	const teacherName =
		(stream as any)?.author?.name ||
		(stream as any)?.author?.fullName ||
		(stream as any)?.ownerName ||
		(stream as any)?.createdBy?.name ||
		'Docente';

	const getFullscreenTarget = () => {
		if (isStreamer) {
			if (isScreenSharing && screenRef.current) return screenRef.current;
			return localVideoRef.current;
		}
		if (isScreenSharing && screenRef.current) return screenRef.current;
		return remoteVideoRef.current;
	};

	const handleFullscreen = () => toggleFullscreen(getFullscreenTarget());

	const onViewerToggleCam = async () => {
		if (viewerCamOn) {
			viewerStopCam();
			if (viewerLocalPreviewRef.current) {
				try {
					const so = viewerLocalPreviewRef.current.srcObject as MediaStream | null;
					so?.getTracks().forEach(t => t.stop());
				} catch {}
				viewerLocalPreviewRef.current.srcObject = null;
				viewerLocalPreviewRef.current.removeAttribute('src');
				viewerLocalPreviewRef.current.load();
			}
			setViewerCamOn(false);
			return;
		}
		try {
			const ms = await viewerStartCam();
			if (viewerLocalPreviewRef.current) {
				viewerLocalPreviewRef.current.srcObject = ms;
				viewerLocalPreviewRef.current.muted = true;
				await viewerLocalPreviewRef.current.play().catch(() => {});
			}
			setViewerCamOn(true);
		} catch (e) {
			console.warn('[VIEWER] no se pudo iniciar cámara', e);
		}
	};

	const onViewerToggleScreen = async () => {
		if (viewerScreenOn) {
			viewerStopScreenShare();
			clearVideoEl('viewerLocalScreen');
			setViewerScreenOn(false);
			return;
		}
		try {
			const displayStream = await viewerStartScreenShare();
			attachLocalPreview('viewerLocalScreen', displayStream, { muted: true });
			setViewerScreenOn(true);
		} catch (e) {
			console.warn('[VIEWER] no se pudo compartir pantalla', e);
		}
	};

	return (
		<SmartBox
			column
			gap="px8"
			style={{
				width: '100%',
				flex: focusMode ? 1 : undefined,
				minHeight: focusMode ? 0 : undefined,
			}}
		>
			<style>{PLAYER_GLOBAL_CSS}</style>

			<StreamPlayerHeader
				title={stream?.title}
				description={stream?.description}
				teacherName={teacherName}
				viewersCount={viewers?.length ?? 0}
			/>

			{/* ✅ en focusMode no limitamos ancho y dejamos crecer alto */}
			<SmartBox
				column
				style={{
					width: '100%',
					maxWidth: focusMode ? '100%' : 1120,
					margin: focusMode ? 0 : '8px auto 0',
					gap: 12,
					flex: 1,
					minHeight: 0,
				}}
			>
				<StreamMainView
					isStreamer={isStreamer}
					isScreenSharing={isScreenSharing}
					localVideoRef={localVideoRef}
					remoteVideoRef={remoteVideoRef}
					screenRef={screenRef}
					viewerLocalPreviewRef={viewerLocalPreviewRef}
					viewerCamOn={viewerCamOn}
					viewerScreenOn={viewerScreenOn}
					focusMode={focusMode}
				/>

				{isStreamer && !isScreenSharing && (
					<HostBadge teacherName={teacherName} />
				)}

				{isStreamer ? (
					<>
						<StreamerControls
							isScreenSharing={isScreenSharing}
							isCamOn={isCamOn}
							isMicOn={isMicOn}
							viewers={viewers}
							showViewers={showViewers}
							toggleViewers={() => setShowViewers(p => !p)}
							startScreen={startScreenShare}
							stopScreen={stopScreenShare}
							toggleCam={toggleCamera}
							toggleMic={toggleMic}
							startRec={startRecording}
							stopRec={stopRecording}
							kickViewer={kickViewer}
							leave={handleLeaveStream}
							endStream={endStream}
							fullscreen={handleFullscreen}
							isFullscreen={isFullscreen}
						/>

						<ScreenShareCarousel
							label="Pantallas compartidas por estudiantes"
							ariaLabel="Pantallas compartidas por estudiantes"
						/>
					</>
				) : (
					<>
						<ViewerControls
							audioEnabled={audioEnabled}
							toggleAudio={toggleAudio}
							fullscreen={handleFullscreen}
							isFullscreen={isFullscreen}
							leave={handleLeaveStream}
							camOn={viewerCamOn}
							onToggleCam={onViewerToggleCam}
							screenOn={viewerScreenOn}
							onToggleScreen={onViewerToggleScreen}
							focusMode={focusMode}
						/>

						<ScreenShareCarousel
							label="Pantallas compartidas de otros participantes"
							ariaLabel="Pantallas compartidas por otros estudiantes"
						/>
					</>
				)}
			</SmartBox>
		</SmartBox>
	);
};

export default StreamPlayer;

