// src/ui/features/stream/organisms/StreamPlayer.tsx
import React, { useState } from 'react';
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
		startScreenShare,
		stopScreenShare,
		startRecording,
		stopRecording,
		kickViewer,          // <-- viene del mismo hook
		handleLeaveStream,
	} = useStreamConnection({ streamId, isStreamer, accessCode, onStreamEnd });

	const [showViewers, setShowViewers] = useState(false);

	return (
		<SmartBox column gap="px8">
			<Text size="lg" weight="bold">Stream {streamId}</Text>

			{isStreamer ? (
				<>
					<Text>Transmitiendo…</Text>
					<video id="localVideo" autoPlay muted playsInline style={{ width: '100%' }} />

					{/* Controles */}
					<SmartBox row gap="px4" >
						<GhostButton
							label={isScreenSharing ? 'Detener Pantalla' : 'Compartir Pantalla'}
							onClick={isScreenSharing ? stopScreenShare : startScreenShare}
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

					{isScreenSharing && (
						<>
							<Text>Compartiendo pantalla…</Text>
							<video id="screenVideo" autoPlay muted style={{ width: '100%' }} />
						</>
					)}

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
											onClick={() => kickViewer(v._id)}
										/>
									</li>
								))}
							</ul>
						</>
					)}
				</>
			) : (
				<>
					<Text>Viendo el stream…</Text>
					<video id="remoteVideo" autoPlay playsInline style={{ width: '100%' }} />
					<video id="screenVideo" autoPlay playsInline style={{ width: '100%' }} />
					<GhostButton label="Salir del Stream" onClick={handleLeaveStream} />
				</>
			)}
		</SmartBox>
	);
};

export default StreamPlayer;

