import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import VideoSurface from './VideoSurface';

interface Props {
	isStreamer: boolean;
	isScreenSharing: boolean;
	localVideoRef: React.RefObject<HTMLVideoElement>;
	remoteVideoRef: React.RefObject<HTMLVideoElement>;
	screenRef: React.RefObject<HTMLVideoElement>;

	viewerLocalPreviewRef: React.RefObject<HTMLVideoElement>;
	viewerCamOn: boolean;
	viewerScreenOn: boolean;

	focusMode?: boolean;
}

const StreamMainView: React.FC<Props> = ({
	isStreamer,
	isScreenSharing,
	localVideoRef,
	remoteVideoRef,
	screenRef,
	viewerLocalPreviewRef,
	viewerCamOn,
	viewerScreenOn,
	focusMode = false,
}) => {
	/* ✅ focusMode rellena alto total y quita aspect ratio */
	const shellStyle: React.CSSProperties = focusMode
		? {
			position: 'relative',
			width: '100%',
			height: '100%',
			background: 'transparent',
			borderRadius: 12,
			padding: 0,
			boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
			overflow: 'hidden',
			minHeight: 260,
			flex: 1,
		}
			: {
				position: 'relative',
				width: '100%',
				background: '#05070A',
				borderRadius: 16,
				padding: 12,
				boxShadow: '0 18px 45px rgba(0,0,0,0.45)',
				overflow: 'hidden',
				minHeight: 260,
			};

			const frameStyle: React.CSSProperties = focusMode
				? {
					position: 'relative',
					width: '100%',
					height: '100%',
					borderRadius: 12,
					overflow: 'hidden',
					background: '#000',
				}
					: {
						position: 'relative',
						width: '100%',
						borderRadius: 12,
						overflow: 'hidden',
						background: '#000',
						aspectRatio: '16 / 9',
					};

					const mainFit = focusMode ? 'contain' : 'cover';

					const pipStyle: React.CSSProperties = {
						position: 'absolute',
						right: 14,
						bottom: 14,
						width: focusMode ? 200 : 220,
						height: focusMode ? 112 : 124,
						borderRadius: 10,
						objectFit: 'cover',
						boxShadow: '0 8px 20px rgba(0,0,0,0.40)',
						border: '1px solid rgba(255,255,255,0.18)',
					};

					return (
						<SmartBox className="video-shell" style={shellStyle}>
							<SmartBox style={frameStyle}>
								{/* NIVEL 1: LO QUE EL PROFESOR ESTÁ MOSTRANDO */}
								{isStreamer ? (
									<>
										<VideoSurface
											ref={screenRef}
											id="screenVideo"
											autoPlay
											playsInline
											hiddenWhenEmpty
											style={
												isScreenSharing
													? { width: '100%', height: '100%', objectFit: mainFit }
													: { display: 'none' }
											}
										/>

										<VideoSurface
											ref={localVideoRef}
											id="localVideo"
											autoPlay
											muted
											playsInline
											style={
												isScreenSharing
													? pipStyle
													: { width: '100%', height: '100%', objectFit: mainFit }
											}
										/>
									</>
								) : (
									<>
										<VideoSurface
											ref={screenRef}
											id="screenVideo"
											autoPlay
											playsInline
											hiddenWhenEmpty
											style={
												isScreenSharing
													? { width: '100%', height: '100%', objectFit: mainFit }
													: { display: 'none' }
											}
										/>

										<VideoSurface
											ref={remoteVideoRef}
											id="remoteVideo"
											autoPlay
											playsInline
											style={
												isScreenSharing
													? pipStyle
													: { width: '100%', height: '100%', objectFit: mainFit }
											}
										/>
									</>
								)}

								{/* NIVEL 2 EXTRA (viewer): PREVIEW DEL ESTUDIANTE */}
								{!isStreamer && (
									<>
										<video
											ref={viewerLocalPreviewRef}
											id="viewerLocalPreview"
											autoPlay
											muted
											playsInline
											style={{
												position: 'absolute',
												left: 12,
												bottom: 12,
												width: focusMode ? 120 : 140,
												height: focusMode ? 68 : 80,
												borderRadius: 8,
												objectFit: 'cover',
												boxShadow: '0 8px 18px rgba(0,0,0,.35)',
												display: viewerCamOn ? 'block' : 'none',
												background: '#000',
												border: '1px solid rgba(255,255,255,0.14)',
											}}
										/>

										<video
											id="viewerLocalScreen"
											autoPlay
											muted
											playsInline
											style={{
												position: 'absolute',
												left: viewerCamOn ? (focusMode ? 142 : 168) : 12,
												bottom: 12,
												width: focusMode ? 120 : 140,
												height: focusMode ? 68 : 80,
												borderRadius: 8,
												objectFit: 'cover',
												boxShadow: '0 8px 18px rgba(0,0,0,.35)',
												display: viewerScreenOn ? 'block' : 'none',
												background: '#000',
												border: '1px solid rgba(255,255,255,0.14)',
											}}
										/>
									</>
								)}
							</SmartBox>
						</SmartBox>
					);
};

export default StreamMainView;

