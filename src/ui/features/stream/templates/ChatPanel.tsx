// src/ui/features/stream/templates/ChatPanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
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

	typingUsers?: string[];
	onTyping?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
	streamId,
	viewers,
	typingUsers = [],
	onTyping,
}) => {
	const { HOST } = getEnvVariables();
	const { messages, sendMessage } = useStreamChat(streamId);

	const [input, setInput] = useState('');
	const [recipientId, setRecipientId] = useState<string>(''); // '' = chat público
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage(input, recipientId || undefined);
		setInput('');
	};

	let typingLabel = '';
	if (typingUsers.length === 1) {
		typingLabel = `${typingUsers[0]} está escribiendo…`;
	} else if (typingUsers.length === 2) {
		typingLabel = `${typingUsers[0]} y ${typingUsers[1]} están escribiendo…`;
	} else if (typingUsers.length > 2) {
		typingLabel = 'Varios participantes están escribiendo…';
	}

	return (
		<ChatContainer
			elevation={1}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
			}}

		>
			{/* ─── header ─── */}
			<Header>
				<SectionTitle>Chat</SectionTitle>
				<MessageText
					variant="caption"
					sx={{ opacity: 0.7, marginLeft: 'auto' }}
				>
					Chat en vivo
				</MessageText>
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

			{/* ─── mensajes (scroll independiente) ─── */}
			<Messages>
				{messages.length === 0 && (
					<MessageText variant="body2" sx={{ opacity: 0.6, px: 1, py: 0.5 }}>
						No hay mensajes todavía. Sé el primero en preguntar o saludar. 🙂
					</MessageText>
				)}

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
								<MessageText variant="caption" color="primary" sx={{ ml: 1 }}>
									(Privado)
								</MessageText>
							)}
						</MessageText>
					</MessageRow>
				))}
				<div ref={bottomRef} />
			</Messages>

			{/* ─── indicador "escribiendo..." ─── */}
			{typingLabel && (
				<div style={{ padding: '2px 10px 4px', minHeight: 18 }}>
					<MessageText
						variant="caption"
						sx={{
							opacity: 0.75,
							fontStyle: 'italic',
							animation: 'typingPulse 1.4s ease-in-out infinite',
						}}
					>
						{typingLabel}
					</MessageText>
				</div>
			)}

			{/* ─── input fijo abajo ─── */}
			<Footer onSubmit={handleSubmit}>
				<TextField
					size="small"
					fullWidth
					placeholder="Escribe un mensaje"
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						onTyping?.();
					}}
				/>
			</Footer>

			{/* animación para el indicador de typing */}
			<style>
				{`
					@keyframes typingPulse {
						0% { opacity: .55; transform: translateY(0); }
						50% { opacity: 1; transform: translateY(-1px); }
						100% { opacity: .55; transform: translateY(0); }
					}
					`}
			</style>
		</ChatContainer>
	);
};

export default ChatPanel;

