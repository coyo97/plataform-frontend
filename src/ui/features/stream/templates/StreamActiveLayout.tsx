// src/ui/features/stream/organisms/StreamActiveLayout.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import StreamPlayer from '../organisms/streamPlayer/StreamPlayer';
import StreamList     from '../organisms/StreamList';
import SectionTitle   from '../../../shared/atoms/titles/SectionTitle';
import ChatPanel from './ChatPanel';
import { useSocket }  from '../../../shared/hooks/useSocket';

interface Props {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd: () => void;
}

const StreamActiveLayout: React.FC<Props> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
}) => {
	const theme    = useTheme();
	const socket   = useSocket();
	const [viewers, setViewers] =
		useState<{ _id: string; username: string }[]>([]);

	/* recibe lista actualizada del backend */
	useEffect(() => {
		const handler = ({ viewers }: { viewers: { _id:string; username:string }[] }) =>
			setViewers(viewers);

		socket.on('update-viewers', handler);  // solo el streamer
		socket.on('viewer-list',   handler);   // todos

		return () => {
			socket.off('update-viewers', handler);
			socket.off('viewer-list',    handler);
		};
	}, [socket]);

	return (
		<Grid container spacing={theme.padding.px6}>
			{/* reproductor */}
			<Grid item xs={12} md={8}>
				<StreamPlayer
					streamId={streamId}
					isStreamer={isStreamer}
					accessCode={accessCode}
					onStreamEnd={onStreamEnd}
				/>
			</Grid>

			{/* columna derecha */}
			<Grid item xs={12} md={4} sx={{ display:'flex', flexDirection:'column', gap:theme.padding.px6 }}>
				<ChatPanel streamId={streamId} viewers={viewers} />

				<Box>
					<SectionTitle>Streams activos</SectionTitle>
					<StreamList dense />
				</Box>
			</Grid>
		</Grid>
	);
};

export default StreamActiveLayout;

