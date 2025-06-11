// src/ui/features/stream/organisms/StreamActiveLayout.tsx
import React from 'react';
import { Grid, Box, useTheme, Paper, TextField } from '@mui/material';
import StreamPlayer from '../organisms/StreamPlayer';
import StreamList from '../organisms/StreamList';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';

interface Props {
	streamId: string;
	isStreamer: boolean;
	accessCode?: string;
	onStreamEnd: () => void;
}

const ChatPanel: React.FC = () => {
	const theme = useTheme();
	return (
		<Paper sx={{ height: 400, display: 'flex', flexDirection: 'column' }} elevation={1}>
			<Box sx={{ p: theme.padding.px4, borderBottom: `1px solid ${theme.palette.divider}` }}>
				<SectionTitle>Chat</SectionTitle>
			</Box>
			<Box sx={{ flex: 1, overflowY: 'auto', p: theme.padding.px4 }}>
				{/* TODO: mensajes */}
			</Box>
			<Box sx={{ p: theme.padding.px4, borderTop: `1px solid ${theme.palette.divider}` }}>
				<TextField size="small" fullWidth placeholder="Escribe un mensaje" />
			</Box>
		</Paper>
	);
};

const StreamActiveLayout: React.FC<Props> = ({
	streamId,
	isStreamer,
	accessCode,
	onStreamEnd,
}) => {
	const theme = useTheme();
	return (
		<Grid container spacing={theme.padding.px6}>
			{/* StreamPlayer grande */}
			<Grid item xs={12} md={8} sx={{ minHeight: 300 }}>
				<StreamPlayer
					streamId={streamId}
					isStreamer={isStreamer}
					accessCode={accessCode}
					onStreamEnd={onStreamEnd}
				/>
			</Grid>

			{/* Columna derecha */}
			<Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: theme.padding.px6 }}>
				<ChatPanel />

				<Box>
					<SectionTitle>Streams activos</SectionTitle>
					<StreamList dense /> 
				</Box>
			</Grid>
		</Grid>
	);
};

export default StreamActiveLayout;

