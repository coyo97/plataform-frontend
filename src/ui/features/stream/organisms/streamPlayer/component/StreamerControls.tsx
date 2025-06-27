// components/StreamerControls.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import GhostButton from '../../../../../shared/atoms/buttons/ghostButton/GhostButton';
import FilledButton from '../../../../../shared/atoms/buttons/filledButton/FilledButton';
import Text from '../../../../../shared/atoms/typography/Text';

interface Props {
	isScreenSharing: boolean;
	isCamOn: boolean;
	isMicOn: boolean;
	viewers: { _id: string; username: string }[];
	showViewers: boolean;
	toggleViewers: () => void;
	startScreen: () => void;
	stopScreen : () => void;
	toggleCam  : () => void;
	toggleMic  : () => void;
	startRec   : () => void;
	stopRec    : () => void;
	kickViewer : (id: string) => void;
	leave      : () => void;
	fullscreen : () => void;
	isFullscreen: boolean;
}

const StreamerControls: React.FC<Props> = ({
	isScreenSharing,
	isCamOn,
	isMicOn,
	viewers,
	showViewers,
	toggleViewers,
	startScreen,
	stopScreen,
	toggleCam,
	toggleMic,
	startRec,
	stopRec,
	kickViewer,
	leave,
	fullscreen,
	isFullscreen,
}) => (
	<>
		<SmartBox row gap="px4">
			<GhostButton
				label={isScreenSharing ? 'Detener pantalla' : 'Compartir pantalla'}
				onClick={isScreenSharing ? stopScreen : startScreen}
			/>
			<GhostButton
				label={isCamOn ? 'Apagar cámara' : 'Encender cámara'}
				onClick={toggleCam}
			/>
			<GhostButton
				label={isMicOn ? 'Silenciar' : 'Activar micrófono'}
				onClick={toggleMic}
			/>
			<GhostButton label="Grabar" onClick={startRec} />
			<GhostButton label="Detener/Descargar" onClick={stopRec} />
			<GhostButton
				label={showViewers ? 'Ocultar espectadores' : `Espectadores (${viewers.length})`}
				onClick={toggleViewers}
			/>
			<GhostButton
				label={isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
				onClick={fullscreen}
			/>
			<GhostButton label="Detener Stream" colorType="secondary" onClick={leave} />
		</SmartBox>

		{showViewers && (
			<>
				<Text >Espectadores:</Text>
				<ul>
					{viewers.map((v) => (
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
);

export default StreamerControls;

