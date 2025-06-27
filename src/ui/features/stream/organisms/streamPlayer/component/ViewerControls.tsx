// components/ViewerControls.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import GhostButton from '../../../../../shared/atoms/buttons/ghostButton/GhostButton';

interface Props {
	audioEnabled: boolean;
	toggleAudio : () => void;
	fullscreen  : () => void;
	isFullscreen: boolean;
	leave       : () => void;
}

const ViewerControls: React.FC<Props> = ({
	audioEnabled,
	toggleAudio,
	fullscreen,
	isFullscreen,
	leave,
}) => (
	<SmartBox row gap="px4" sx={{ mt: 1 }} >
		<GhostButton
			label={audioEnabled ? 'Silenciar' : 'Escuchar'}
			onClick={toggleAudio}
		/>
		<GhostButton
			label={isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
			onClick={fullscreen}
		/>
		<GhostButton label="Salir" onClick={leave} />
	</SmartBox>
);

export default ViewerControls;

