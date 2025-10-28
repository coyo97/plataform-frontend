// component/ViewerControls.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import GhostButton from '../../../../../shared/atoms/buttons/ghostButton/GhostButton';
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
  toggleAudio : () => void;
  fullscreen  : () => void;
  isFullscreen: boolean;
  leave       : () => void;

  // NUEVO
  camOn: boolean;
  onToggleCam: () => void;
  screenOn: boolean;
  onToggleScreen: () => void;
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
}) => (
  <SmartBox
    row
    between
    style={{
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      zIndex: 5,
      backdropFilter: 'blur(6px)',
      background: 'rgba(20,20,20,0.5)',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.08)',
      padding: 8,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
    }}
  >
    {/* izquierda */}
    <SmartBox row gap="px1">
      {/* audio remoto */}
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

      {/* cámara propia (envío al streamer) */}
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

      {/* compartir pantalla propia (envío al streamer) */}
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
    <SmartBox row gap="px1">
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
              borderRadius: 8,
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

