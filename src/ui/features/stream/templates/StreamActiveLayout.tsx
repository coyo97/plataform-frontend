// src/ui/features/stream/organisms/StreamActiveLayout.tsx
import React, { useEffect, useState } from 'react';
import {
	Grid,
	Box,
	useTheme,
	useMediaQuery,
	Tabs,
	Tab,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Card,
	CardContent,
	Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StreamPlayer from '../organisms/streamPlayer/StreamPlayer';
import StreamList from '../organisms/StreamList';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import ChatPanel from './ChatPanel';
import { useSocket } from '../../../shared/hooks/useSocket';
import { Stream } from '../../../../types/stream';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn'

interface Props {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd: () => void;
	stream?: Stream;
}

type MobileTab = 'video' | 'chat' | 'controls';

const StreamActiveLayout: React.FC<Props> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
	stream,
}) => {
	const theme = useTheme();
	const isMdDown = useMediaQuery(theme.breakpoints.down('md')); // ≤ 960px
	const isSmDown = useMediaQuery(theme.breakpoints.down('sm')); // ≤ 600px

	const socket = useSocket();
	const [viewers, setViewers] = useState<{ _id: string; username: string }[]>([]);
	const [tab, setTab] = useState<MobileTab>('video');

	/* Recibe lista actualizada del backend */
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

	// ---------- Desktop (mdUp): layout de 2 columnas como tenías ----------
	// ---------- Desktop (mdUp): layout ancho con tu grid ----------
	if (!isMdDown) {
		return (
			<GridContainer
				variant="desktopFluid"
				style={{ paddingTop: '16px', paddingBottom: '24px' }}
				columns={{ md: 12, lg: 12 }}
			>
				{/* Video principal (9/12) */}
				<GridColumn span={{ xxs: 12, md: 9, lg: 9 }}>
					<Box
						sx={{
							borderRadius: 2,
							overflow: 'hidden',
							boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
						}}
					>
						<StreamPlayer
							stream={stream}
							streamId={streamId}
							isStreamer={isStreamer}
							accessCode={accessCode}
							onStreamEnd={onStreamEnd}
						/>
					</Box>
				</GridColumn>

				{/* Columna derecha: Chat + Streams activos (3/12) */}
				<GridColumn span={{ xxs: 12, md: 3, lg: 3 }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
							maxHeight: 'calc(100dvh - var(--header-h) - 40px)',
						}}
					>
						{/* Chat crece y hace scroll */}
						<Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
							<ChatPanel streamId={streamId} viewers={viewers} />
						</Box>

						{/* Streams activos abajo */}
						<Box sx={{ flexShrink: 0 }}>
							<SectionTitle>Streams activos</SectionTitle>
							<StreamList dense />
						</Box>
					</Box>
				</GridColumn>
			</GridContainer>
		);
	}


	// ---------- mdDown (≤960px) ----------
	// Para smDown (≤600px) usamos Tabs (Transmisión / Chat / Controles).
	// Para el rango (600px, 960px], apilamos secciones una debajo de otra.
	if (!isSmDown) {
		return (
			<Grid container spacing={theme.padding.px6}>
				{/* Video arriba */}
				<Grid item xs={12}>
					<StreamPlayer
						stream={stream}
						streamId={streamId}
						isStreamer={isStreamer}
						accessCode={accessCode}
						onStreamEnd={onStreamEnd}
					/>
				</Grid>

				{/* Chat debajo con altura razonable */}
				<Grid item xs={12}>
					<Box sx={{ maxHeight: '56dvh', overflow: 'auto' }}>
						<ChatPanel streamId={streamId} viewers={viewers} />
					</Box>
				</Grid>

				{/* Streams activos en acordeón para no apretar */}
				<Grid item xs={12}>
					<Accordion defaultExpanded={false} disableGutters>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<SectionTitle>Streams activos</SectionTitle>
						</AccordionSummary>
						<AccordionDetails>
							<StreamList dense />
						</AccordionDetails>
					</Accordion>
				</Grid>
			</Grid>
		);
	}

	// ---------- smDown (≤600px): Tabs ----------
	return (
		<Box>
			<Tabs
				value={tab}
				onChange={(_, v) => setTab(v)}
				variant="fullWidth"
				aria-label="Vista móvil de stream"
				sx={{ mb: 1 }}
			>
				<Tab value="video" label="Transmisión" />
				<Tab value="chat" label="Chat" />
				<Tab value="controls" label="Controles" />
			</Tabs>

			{/* Transmisión */}
			{tab === 'video' && (
				<Box>
					<StreamPlayer
						stream={stream}
						streamId={streamId}
						isStreamer={isStreamer}
						accessCode={accessCode}
						onStreamEnd={onStreamEnd}
					/>
				</Box>
			)}

			{/* Chat */}
			{tab === 'chat' && (
				<Box sx={{ maxHeight: '72dvh', overflowY: 'auto' }}>
					<ChatPanel streamId={streamId} viewers={viewers} />
				</Box>
			)}

			{/* Controles: recordatorio (la toolbar ya vive sobre el video) */}
			{tab === 'controls' && (
				<Card elevation={1} sx={{ mt: 1 }}>
					<CardContent>
						<Typography variant="subtitle1" fontWeight={700} gutterBottom>
							Controles de transmisión
						</Typography>
						<Typography variant="body2" paragraph>
							Los controles (micrófono, cámara, compartir pantalla, grabar/descargar y finalizar)
							están disponibles como una <strong>barra flotante</strong> sobre el video cuando estás en
							la pestaña <em>Transmisión</em>.
						</Typography>
						<Typography variant="body2">
							Sugerencia: si la barra se superpone, toca una vez sobre el video para
							que se muestre/oculte; en horizontal tendrás más espacio.
						</Typography>
					</CardContent>
				</Card>
			)}

			{/* Streams activos en acordeón (acceso rápido) */}
			<Accordion sx={{ mt: 2 }} disableGutters>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<SectionTitle>Streams activos</SectionTitle>
				</AccordionSummary>
				<AccordionDetails>
					<StreamList dense />
				</AccordionDetails>
			</Accordion>
		</Box>
	);
};

export default StreamActiveLayout;

