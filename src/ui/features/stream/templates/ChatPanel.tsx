// src/ui/features/stream/organisms/ChatPanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import getEnvVariables from '../../../../config/configEnvs';
import { useStreamChat } from '../hooks/useStreamChat';

import {
	ChatContainer,
	Header,
	RecipientBox,
	Messages,
	MessageRow,
	Footer,
	MessageText,
} from './ChatPanel.styles';

interface ChatPanelProps {
	streamId: string;
	viewers: { _id: string; username: string }[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ streamId, viewers }) => {
	const theme = useTheme();
	const { HOST } = getEnvVariables();
	const { messages, sendMessage } = useStreamChat(streamId);

	const [input, setInput] = useState('');
	const [recipientId, setRecipientId] = useState<string>(''); // '' = chat público
	const bottomRef = useRef<HTMLDivElement>(null);

	/* autoscroll */
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage(input, recipientId || undefined);
		setInput('');
	};

	return (
		<ChatContainer elevation={1}>
			{/* ─── header ─── */}
			<Header>
				<SectionTitle>Chat</SectionTitle>
			</Header>

			{/* ─── selector de destinatario ─── */}
			<RecipientBox>
				<Autocomplete
					size="small"
					options={viewers}
					getOptionLabel={(v) => v.username}
					value={viewers.find((v) => v._id === recipientId) ?? null}
					onChange={(_, val) => setRecipientId(val?._id ?? '')}
					renderInput={(params) => (
						<TextField {...params} placeholder="Enviar a (vacío = todos)" />
					)}
				/>
			</RecipientBox>

			{/* ─── mensajes ─── */}
			<Messages>
				{messages.map((m, idx) => (
					<MessageRow key={idx}>
						<AvatarX
							src={m.profilePicture ? `${HOST}/${m.profilePicture}` : undefined}
							alt={m.username ?? 'usuario'}
							sx={{ mr: 1 }}
						/>
						<MessageText variant="body2">
							<strong>{m.username ?? 'Anon'}:</strong> {m.content}
							{m.toUserId && (
								<MessageText  variant="caption" color="primary" sx={{ ml: 1 }}>
									(Privado)
								</MessageText>
							)}
						</MessageText>
					</MessageRow>
				))}
				<div ref={bottomRef} />
			</Messages>

			{/* ─── input ─── */}
			<Footer onSubmit={handleSubmit}>
				<TextField
					size="small"
					fullWidth
					placeholder="Escribe un mensaje"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
			</Footer>
		</ChatContainer>
	);
};

export default ChatPanel;

