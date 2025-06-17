// src/ui/features/stream/organisms/ChatPanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
	Box, Paper, TextField, Typography, Autocomplete, useTheme,
} from '@mui/material';
import AvatarX          from '../../../shared/atoms/avatar/AvatarX';
import SectionTitle     from '../../../shared/atoms/titles/SectionTitle';
import getEnvVariables  from '../../../../config/configEnvs';
import { useStreamChat } from '../hooks/useStreamChat';

interface ChatPanelProps {
	streamId: string;
	viewers : { _id: string; username: string }[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ streamId, viewers }) => {
	const theme = useTheme();
	const { HOST } = getEnvVariables();
	const { messages, sendMessage } = useStreamChat(streamId);

	const [input, setInput]           = useState('');
	const [recipientId, setRecipientId] = useState<string>(''); // '' = chat público
	const bottomRef = useRef<HTMLDivElement>(null);

	/* autoscroll */
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior:'smooth' });
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage(input, recipientId || undefined);
		setInput('');
	};

	return (
		<Paper sx={{ height: 400, display:'flex', flexDirection:'column' }} elevation={1}>
			<Box sx={{ p:theme.padding.px4, borderBottom:`1px solid ${theme.palette.divider}` }}>
				<SectionTitle>Chat</SectionTitle>
			</Box>

			{/* selector de destinatario */}
			<Box sx={{ p:theme.padding.px4 }}>
				<Autocomplete
					size="small"
					options={viewers}
					getOptionLabel={(v) => v.username}
					value={viewers.find(v => v._id === recipientId) ?? null}
					onChange={(_, val) => setRecipientId(val?._id ?? '')}
					renderInput={(params) => (
						<TextField {...params} placeholder="Enviar a (vacío = todos)" />
					)}
				/>
			</Box>

			{/* mensajes */}
			<Box sx={{ flex:1, overflowY:'auto', px:theme.padding.px4 }}>
				{messages.map((m, idx) => (
					<Box key={idx} sx={{ display:'flex', alignItems:'center', mb:1 }}>
						<AvatarX
							src={m.profilePicture ? `${HOST}/${m.profilePicture}` : undefined}
							alt={m.username ?? 'usuario'}
							sx={{ mr:1 }}
						/>
						<Typography variant="body2">
							<strong>{m.username ?? 'Anon'}:</strong> {m.content}
							{m.toUserId && (
								<Typography component="span" variant="caption" color="primary" sx={{ ml:1 }}>
									(Privado)
								</Typography>
							)}
						</Typography>
					</Box>
				))}
				<div ref={bottomRef} />
			</Box>

			{/* input */}
			<Box component="form" onSubmit={handleSubmit}
				sx={{ p:theme.padding.px4, borderTop:`1px solid ${theme.palette.divider}` }}>
				<TextField
					size="small"
					fullWidth
					placeholder="Escribe un mensaje"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
			</Box>
		</Paper>
	);
};

export default ChatPanel;

