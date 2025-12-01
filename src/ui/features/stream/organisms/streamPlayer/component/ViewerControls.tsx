// component/ViewerControls.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import { IconButton, Tooltip } from '@mui/material';
import {
	VolumeUp as VolOnIcon,
	VolumeOff as VolOffIcon,
	Videocam as CamOnIcon,
	VideocamOff as CamOffIcon,
	PresentToAll as ScreenIcon,
	StopScreenShare as StopScreenIcon,
	Fullscreen as FullIcon,
	FullscreenExit as FullExitIcon,
	CallEnd as EndIcon,
} from '@mui/icons-material';

interface Props {
	audioEnabled: boolean;
	toggleAudio: () => void;
	fullscreen: () => void;
	isFullscreen: boolean;
	leave: () => void;

	camOn: boolean;
	onToggleCam: () => void;
	screenOn: boolean;
	onToggleScreen: () => void;

	focusMode?: boolean;
}

const ViewerControls: React.FC<Props> = ({
	audioEnabled,
	toggleAudio,
	fullscreen,
	isFullscreen,
	leave,
	camOn,
	onToggleCam,
	screenOn,
	onToggleScreen,
	focusMode = false,
}) => (
	<SmartBox
		row
		between
		style={{
			position: focusMode ? 'fixed' : 'relative',
			left: focusMode ? '50%' : undefined,
			bottom: focusMode ? 16 : undefined,
			transform: focusMode ? 'translateX(-50%)' : undefined,
			zIndex: focusMode ? 1600 : undefined,

			marginTop: focusMode ? 0 : 12,
			padding: '8px 12px',
			borderRadius: 999,
			background: 'rgba(10, 10, 12, 0.82)',
			border: '1px solid rgba(255,255,255,0.10)',
			boxShadow: focusMode
				? '0 10px 30px rgba(0,0,0,0.55)'
				: '0 6px 18px rgba(0,0,0,0.35)',
				backdropFilter: 'blur(8px)',

				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				gap: 8,
		}}
	>
		{/* izquierda */}
		<SmartBox row gap="px1" style={{ alignItems: 'center' }}>
			<Tooltip title={audioEnabled ? 'Silenciar reproducción' : 'Escuchar audio'}>
				<span>
					<IconButton
						aria-label={audioEnabled ? 'Silenciar reproducción' : 'Escuchar audio'}
						aria-pressed={audioEnabled}
						onClick={toggleAudio}
					>
						{audioEnabled ? <VolOnIcon /> : <VolOffIcon />}
					</IconButton>
				</span>
			</Tooltip>

			<Tooltip title={camOn ? 'Apagar mi cámara' : 'Encender mi cámara'}>
				<span>
					<IconButton
						aria-label={camOn ? 'Apagar mi cámara' : 'Encender mi cámara'}
						aria-pressed={camOn}
						onClick={onToggleCam}
					>
						{camOn ? <CamOnIcon /> : <CamOffIcon />}
					</IconButton>
				</span>
			</Tooltip>

			<Tooltip title={screenOn ? 'Detener mi pantalla' : 'Compartir mi pantalla'}>
				<span>
					<IconButton
						aria-label={screenOn ? 'Detener mi pantalla' : 'Compartir mi pantalla'}
						aria-pressed={screenOn}
						onClick={onToggleScreen}
					>
						{screenOn ? <StopScreenIcon /> : <ScreenIcon />}
					</IconButton>
				</span>
			</Tooltip>
		</SmartBox>

		{/* derecha */}
		<SmartBox row gap="px1" style={{ alignItems: 'center' }}>
			<Tooltip title={isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}>
				<span>
					<IconButton aria-label="Pantalla completa" onClick={fullscreen}>
						{isFullscreen ? <FullExitIcon /> : <FullIcon />}
					</IconButton>
				</span>
			</Tooltip>

			<Tooltip title="Salir de la transmisión">
				<span>
					<IconButton
						aria-label="Salir"
						onClick={leave}
						style={{
							backgroundColor: '#E53935',
							color: '#fff',
							borderRadius: 999,
							width: 44,
							height: 44,
						}}
					>
						<EndIcon />
					</IconButton>
				</span>
			</Tooltip>
		</SmartBox>
	</SmartBox>
);

export default ViewerControls;

