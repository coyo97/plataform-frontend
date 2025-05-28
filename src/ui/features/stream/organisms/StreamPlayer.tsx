// src/ui/features/stream/organisms/StreamPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useStreamConnection } from '../hooks/useStreamConnection';

import Text         from '../../../shared/atoms/typography/Text';
import SmartBox     from '../../../shared/atoms/box/SmartBox';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton  from '../../../shared/atoms/buttons/ghostButton/GhostButton';

interface StreamPlayerProps {
	streamId    : string;
	isStreamer  : boolean;
	accessCode? : string;
	onStreamEnd : () => void;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
}) => {

	const {
		viewers,
		isScreenSharing,
		startScreenShare, stopScreenShare,
		startRecording , stopRecording ,
		toggleCamera   , toggleMic,
		isCamOn , isMicOn,
		kickViewer, handleLeaveStream,
	} = useStreamConnection({ streamId, isStreamer, accessCode, onStreamEnd });

	const [showViewers, setShowViewers] = useState(false);

	/* ───────── mostrar pantalla remota sólo cuando exista pista ───────── */
	const screenRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		if (!screenRef.current) return;
		const st = screenRef.current.srcObject as MediaStream | null;
		screenRef.current.style.display =
			st && st.getVideoTracks().length ? 'block' : 'none';
	});
	const scrVidRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const v = scrVidRef.current;
		if (!v) return;
		v.style.display =
			v.srcObject && (v.srcObject as MediaStream).getVideoTracks().length
				? 'block'
				: 'none';
	});

	return (
		<SmartBox column gap="px8">
			<Text size="lg" weight="bold">Stream {streamId}</Text>

			{/* ═════════════════════════════════ STREAMER ═════════════════════════════ */}
			{isStreamer ? (
				<>
					<Text>Transmitiendo…</Text>

					{/* cámara propia */}
					<video id="localVideo" autoPlay playsInline muted style={{ width:'100%' }} />

					{/* pantalla propia (solo visible cuando comparte) */}
					<video
						id="screenVideo"
						autoPlay playsInline muted
						style={{ width:'100%', marginTop:8, display:isScreenSharing?'block':'none' }}
					/>

					{/* ───── controles ───── */}
					<SmartBox row gap="px4">
						<GhostButton
							label={isScreenSharing ? 'Detener pantalla' : 'Compartir pantalla'}
							onClick={isScreenSharing ? stopScreenShare : startScreenShare}
						/>
						<GhostButton
							label={isCamOn ? 'Apagar cámara' : 'Encender cámara'}
							onClick={toggleCamera}
						/>
						<GhostButton
							label={isMicOn ? 'Silenciar' : 'Activar micrófono'}
							onClick={toggleMic}
						/>
						<GhostButton label="Grabar"            onClick={startRecording} />
						<GhostButton label="Detener/Descargar" onClick={stopRecording} />
						<GhostButton
							label={showViewers ? 'Ocultar espectadores' : `Espectadores (${viewers.length})`}
							onClick={() => setShowViewers(p => !p)}
						/>
						<GhostButton
							label="Detener Stream"
							colorType="secondary"
							onClick={handleLeaveStream}
						/>
					</SmartBox>

					{/* listado de espectadores */}
					{showViewers && (
						<>
							<Text weight="bold">Espectadores:</Text>
							<ul>
								{viewers.map(v => (
									<li key={v._id}>
										{v.username}{' '}
										<FilledButton
											label="Expulsar"
											colorType="secondary"
											btnVariant="ghost"
											sizeType="xs"
											onClick={() => kickViewer(v._id)}
										/>
									</li>
								))}
							</ul>
						</>
					)}
				</>
			) : (
			/* ═════════════════════════════════  VIEWER ═════════════════════════════ */
			<>
				<Text>Viendo el stream…</Text>

				{/* vídeo / audio del streamer */}
				<video id="remoteVideo" autoPlay playsInline style={{ width:'100%' }} />

				{/* pantalla compartida (solo se muestra cuando llega pista) */}
				<video
					id="screenVideo"
					ref={screenRef}
					autoPlay playsInline
					style={{ width:'100%', marginTop:8, display:'none' }}
				/>

				<GhostButton label="Salir" onClick={handleLeaveStream} />
			</>
			)}
		</SmartBox>
	);
};

export default StreamPlayer;

