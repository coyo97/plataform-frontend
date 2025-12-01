// component/StreamerControls.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import GhostButton from '../../../../../shared/atoms/buttons/ghostButton/GhostButton';
import FilledButton from '../../../../../shared/atoms/buttons/filledButton/FilledButton';
import Text from '../../../../../shared/atoms/typography/Text';

import { IconButton, Tooltip, Badge, Menu, MenuItem, useMediaQuery } from '@mui/material';
import {
	Mic as MicOnIcon,
	MicOff as MicOffIcon,
	Videocam as CamOnIcon,
	VideocamOff as CamOffIcon,
	PresentToAll as ScreenIcon,
	StopScreenShare as StopScreenIcon,
	People as PeopleIcon,
	MoreVert as MoreIcon,
	FiberManualRecord as RecordIcon,
	Stop as StopIcon,
	GetApp as DownloadIcon,
	Fullscreen as FullIcon,
	FullscreenExit as FullExitIcon,
	CallEnd as EndIcon,
} from '@mui/icons-material';

interface Props {
	isScreenSharing: boolean;
	isCamOn: boolean;
	isMicOn: boolean;
	isRecording?: boolean;
	viewers: { _id: string; username: string }[];
	showViewers: boolean;
	toggleViewers: () => void;
	startScreen: () => void;
	stopScreen: () => void;
	toggleCam: () => void;
	toggleMic: () => void;
	startRec: () => void;
	stopRec: () => void;
	kickViewer: (id: string) => void;
	leave: () => void;
	endStream: () => void;    
	fullscreen: () => void;
	isFullscreen: boolean;
}

const StreamerControls: React.FC<Props> = ({
	isScreenSharing,
	isCamOn,
	isMicOn,
	isRecording,
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
	endStream,
	fullscreen,
	isFullscreen,
}) => {
	useMediaQuery('(min-width: 900px)'); // md breakpoint
	const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
	const menuOpen = Boolean(menuEl);

	const shareHandlers = isScreenSharing
		? { onClick: stopScreen, icon: <StopScreenIcon />, label: 'Detener pantalla', aria: 'Detener compartir pantalla' }
		: { onClick: startScreen, icon: <ScreenIcon />, label: 'Compartir pantalla', aria: 'Compartir pantalla' };

		const recordHandlers = isRecording
			? { onClick: stopRec, icon: <StopIcon />, label: 'Detener/Guardar', aria: 'Detener grabación' }
			: { onClick: startRec, icon: <RecordIcon />, label: 'Grabar', aria: 'Iniciar grabación' };

			return (
				<>
					{/* Toolbar fija bajo el video */}
					<SmartBox
						row
						between
						gap="px2"
						p="px2"
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
							flexWrap: 'wrap',
							overflowX: 'auto',
						}}
					>
						{/* Grupo primario (siempre visible) */}
						<SmartBox row gap="px1">
							{/* Mic */}
							<Tooltip title={`${isMicOn ? 'Silenciar' : 'Activar micrófono'}  •  atajo: M`}>
								<span>
									<IconButton
										aria-label={isMicOn ? 'Silenciar micrófono' : 'Activar micrófono'}
										aria-pressed={isMicOn}
										onClick={toggleMic}
									>
										{isMicOn ? <MicOnIcon /> : <MicOffIcon />}
									</IconButton>
								</span>
							</Tooltip>

							{/* Cam */}
							<Tooltip title={`${isCamOn ? 'Apagar cámara' : 'Encender cámara'}  •  atajo: C`}>
								<span>
									<IconButton
										aria-label={isCamOn ? 'Apagar cámara' : 'Encender cámara'}
										aria-pressed={isCamOn}
										onClick={toggleCam}
									>
										{isCamOn ? <CamOnIcon /> : <CamOffIcon />}
									</IconButton>
								</span>
							</Tooltip>

							{/* Screen share */}
							<Tooltip title={`${shareHandlers.label}  •  atajo: S`}>
								<span>
									<IconButton
										aria-label={shareHandlers.aria}
										aria-pressed={isScreenSharing}
										onClick={shareHandlers.onClick}
									>
										{shareHandlers.icon}
									</IconButton>
								</span>
							</Tooltip>

							{/* Record */}
							<Tooltip title={`${recordHandlers.label}  •  atajo: R`}>
								<span>
									<IconButton
										aria-label={recordHandlers.aria}
										aria-pressed={isRecording}
										onClick={recordHandlers.onClick}
										style={isRecording ? { color: '#e53935' } : undefined}
									>
										{recordHandlers.icon}
									</IconButton>
								</span>
							</Tooltip>
						</SmartBox>

						{/* Grupo derecho: viewers + overflow + finalizar */}
						<SmartBox row gap="px2">
							<Tooltip title="Espectadores">
								<span>
									<IconButton aria-label="Ver espectadores" onClick={toggleViewers}>
										<Badge badgeContent={viewers.length} color="primary">
											<PeopleIcon />
										</Badge>
									</IconButton>
								</span>
							</Tooltip>

							{/* Overflow */}
							<Tooltip title="Más acciones">
								<span>
									<IconButton aria-label="Más acciones" onClick={(e) => setMenuEl(e.currentTarget)}>
										<MoreIcon />
									</IconButton>
								</span>
							</Tooltip>
							<Menu anchorEl={menuEl} open={menuOpen} onClose={() => setMenuEl(null)}>
								<MenuItem
									onClick={() => {
										fullscreen();
										setMenuEl(null);
									}}
								>
									{isFullscreen ? <FullExitIcon fontSize="small" /> : <FullIcon fontSize="small" />}
									<Text>{isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}</Text>
								</MenuItem>
								<MenuItem
									onClick={() => {
										// si stopRec ya maneja descarga, puedes omitir este item
										stopRec();
										setMenuEl(null);
									}}
								>
									<DownloadIcon fontSize="small" />
									<Text>Descargar</Text>
								</MenuItem>
							</Menu>

							{/* Finalizar */}
							<Tooltip title="Finalizar transmisión • atajo: Q">
								<span>
									<IconButton
										aria-label="Finalizar transmisión"
										onClick={() => {
											if (window.confirm('¿Seguro que deseas finalizar la transmisión?')) {
												endStream();
											}
										}}
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

					{/* Panel de espectadores */}
					{showViewers && (
						<SmartBox mt="px2">
							<Text>Espectadores</Text>
							<ul>
								{viewers.map((v) => (
									<li key={v._id}>
										{v.username}{' '}
										<GhostButton
											label="Expulsar"
											colorType="secondary"
											onClick={() => kickViewer(v._id)}
										/>
									</li>
								))}
							</ul>
						</SmartBox>
					)}
				</>
			);
};

export default StreamerControls;

