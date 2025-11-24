import React, { useEffect, useState } from 'react';
import {
	Grid,
	Box,
	useTheme,
	useMediaQuery,
	IconButton,
	Tooltip,
	Divider,
} from '@mui/material';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

import StreamPlayer from '../organisms/streamPlayer/StreamPlayer';
import StreamList from '../organisms/StreamList';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import Text from '../../../shared/atoms/typography/Text';
import TagChip from '../../../shared/atoms/tags/TagChip';

import { useSocket } from '../../../shared/hooks/useSocket';
import { Stream } from '../../../../types/stream';
import { useHeaderVisibility } from '../../../shared/hooks/useHeaderVisibility';

import ChatDisclosure from '../templates/ChatDisclosure';
import ChatPanel from './ChatPanel';

interface Props {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd: () => void;
	stream?: Stream;
}

const StreamActiveLayout: React.FC<Props> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
	stream,
}) => {
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
	const socket = useSocket();

	const [viewers, setViewers] = useState<{ _id: string; username: string }[]>([]);
	const [focusMode, setFocusMode] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);

	useHeaderVisibility(true);

	useEffect(() => {
		setChatOpen(false);
	}, [streamId]);

	useEffect(() => {
		const handler = ({ viewers }: { viewers: { _id: string; username: string }[] }) =>
			setViewers(viewers);

		socket.on('update-viewers', handler);
		socket.on('viewer-list', handler);

		return () => {
			socket.off('update-viewers', handler);
			socket.off('viewer-list', handler);
		};
	}, [socket]);

	/* ────────── datos derivados ────────── */
	const visibility: 'university' | 'career' | 'private' =
		((stream as any)?.visibility as any) ?? 'university';

	const ownerName =
		(stream as any)?.author?.name ||
		(stream as any)?.author?.fullName ||
		(stream as any)?.createdBy?.name ||
		(stream as any)?.ownerName ||
		'Docente';

	const careerName =
		(stream as any)?.career?.name ||
		(stream as any)?.careerName ||
		(stream as any)?.career ||
		'Carrera no especificada';

	const facultyName =
		(stream as any)?.faculty?.name ||
		(stream as any)?.facultyName ||
		(stream as any)?.faculty ||
		'';

	const privacyLabel =
		visibility === 'private'
			? 'Privado'
			: visibility === 'career'
				? 'Visible para la carrera'
				: 'Visible para la universidad';

	const title = (stream as any)?.title ?? 'Transmisión en vivo';
	const description = (stream as any)?.description || 'Sin descripción detallada.';

	const layoutSpacing = theme.padding?.px6 ?? 16;
	const handleToggleFocusMode = () => setFocusMode((p) => !p);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: layoutSpacing,

				/* ✅ FIX REAL:
				   - En desktop usamos minHeight en lugar de height fijo
				   - En focusMode NO ocultamos overflow
				   - Permitimos que la columna central crezca verticalmente */
				...(isDesktop
					? {
							minHeight: 'calc(100dvh - var(--header-h) - 12px)',
							overflow: focusMode ? 'visible' : 'hidden',
					  }
					: {
							height: '100%',
							minHeight: '70vh',
					  }),
			}}
		>
			{/* Header del stream */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 2,
					flexWrap: 'wrap',
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Text
						as="h1"
						size="lg"
						weight="bold"
						style={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{title}
					</Text>
					<Text size="sm" style={{ opacity: 0.8 }}>
						{ownerName} · {careerName}
						{facultyName ? ` · ${facultyName}` : ''}
					</Text>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<TagChip
						label={privacyLabel}
						color={
							visibility === 'private'
								? 'error'
								: visibility === 'career'
									? 'secondary'
									: 'primary'
						}
					/>

					<Tooltip title={focusMode ? 'Salir de modo concentrado' : 'Modo concentrado'}>
						<span>
							<IconButton aria-label="Modo concentrado" onClick={handleToggleFocusMode}>
								{focusMode ? <CenterFocusWeakIcon /> : <CenterFocusStrongIcon />}
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			</Box>

			<Divider />

			{/* Layout principal */}
			<Grid
				container
				spacing={layoutSpacing}
				alignItems="stretch"
				sx={{
					flex: 1,
					minHeight: 0,
					// ✅ en focus dejamos crecer el container
					height: focusMode ? 'auto' : '100%',
				}}
			>
				{/* Columna izquierda solo desktop */}
				{!focusMode && isDesktop && (
					<Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 1,
								width: '100%',
								padding: 2,
								borderRadius: 2,
								border: (t) => `1px solid ${t.palette.divider}`,
								bgcolor: (t) => t.palette.background.paper,
							}}
						>
							<Text size="sm" weight="bold">Información del stream</Text>
							<Text size="sm" style={{ opacity: 0.85 }}>{description}</Text>

							<Divider sx={{ my: 1 }} />

							<Text size="xs" style={{ opacity: 0.8 }}>Propietario</Text>
							<Text size="sm">{ownerName}</Text>

							<Text size="xs" style={{ opacity: 0.8, marginTop: 8 }}>
								Carrera / Facultad
							</Text>
							<Text size="sm">
								{careerName}
								{facultyName ? ` · ${facultyName}` : ''}
							</Text>
						</Box>
					</Grid>
				)}

				{/* ✅ Columna central */}
				<Grid
					item
					xs={12}
					md={focusMode ? 12 : 6}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: 0,
						height: focusMode ? 'auto' : '100%',
					}}
				>
					<StreamPlayer
						streamId={streamId}
						isStreamer={isStreamer}
						accessCode={accessCode}
						onStreamEnd={onStreamEnd}
						stream={stream}
						focusMode={focusMode}
					/>
				</Grid>

				{/* Columna derecha SOLO desktop */}
				{!focusMode && isDesktop && (
					<Grid
						item
						xs={12}
						md={3}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: layoutSpacing,
							height: '100%',
							minHeight: 0,
						}}
					>
						<Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
							<SectionTitle>Streams activos</SectionTitle>
							<StreamList dense type="live" />
						</Box>
					</Grid>
				)}
			</Grid>

			{/* Info móvil colapsable */}
			{!focusMode && !isDesktop && (
				<Box
					sx={{
						borderRadius: 2,
						border: (t) => `1px solid ${t.palette.divider}`,
						bgcolor: (t) => t.palette.background.paper,
						overflow: 'hidden',
					}}
				>
					<details>
						<summary
							style={{
								listStyle: 'none',
								padding: '10px 12px',
								cursor: 'pointer',
								fontWeight: 700,
								fontSize: 14,
							}}
						>
							Información del stream
						</summary>

						<Box sx={{ p: 2, pt: 1 }}>
							<Text size="sm" style={{ opacity: 0.85 }}>
								{description}
							</Text>

							<Divider sx={{ my: 1 }} />

							<Text size="xs" style={{ opacity: 0.8 }}>
								Propietario
							</Text>
							<Text size="sm">{ownerName}</Text>

							<Text size="xs" style={{ opacity: 0.8, marginTop: 8 }}>
								Carrera / Facultad
							</Text>
							<Text size="sm">
								{careerName}
								{facultyName ? ` · ${facultyName}` : ''}
							</Text>
						</Box>
					</details>
				</Box>
			)}

			{/* Chat */}
			<ChatDisclosure
				open={chatOpen}
				onOpen={() => setChatOpen(true)}
				onClose={() => setChatOpen(false)}
			>
				<ChatPanel streamId={streamId} viewers={viewers} />
			</ChatDisclosure>
		</Box>
	);
};

export default StreamActiveLayout;

