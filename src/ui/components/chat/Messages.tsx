import React, { useRef, useEffect, useState } from 'react';
import { IncomingMessage } from './IncomingMessage';
import { OutgoingMessage } from './OutgoingMessage';

import { MesgsContainer, MsgHistory, MessageInput, SendButton, MessageInputForm } from './message.styles';

// Messages.tsx

interface Message {
	_id: string;
	senderId: string;
	receiverId: string | null;
	content: string;
	isGroupMessage: boolean;
	groupId?: string;
	sender?: {
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};
	isRead: boolean;
	createdAt: string;
	filePath?: string;
	fileType?: string;
}

interface MessagesProps {
	messages: Message[];
	currentUserId: string;
	handleSendMessage: (messageContent: string, selectedFile?: File | null | undefined) => Promise<void>; // Cambiamos 'void' por 'Promise<void>'
}

export const Messages: React.FC<MessagesProps> = ({ messages, currentUserId, handleSendMessage }) => {
	const messagesEndRef = useRef<HTMLDivElement | null>(null); // Referencia para el último mensaje

	const [messageContent, setMessageContent] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Función para desplazarse al último mensaje
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// Efecto que se ejecuta cuando los mensajes cambian
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleSendMessage(messageContent, selectedFile);
		setMessageContent('');
		setSelectedFile(null);
	};
	return (
		<MesgsContainer>
			<MsgHistory>
				{messages.map((msg) =>
							  msg.senderId === currentUserId ? (
								  <OutgoingMessage key={`${msg._id}-${msg.createdAt || Math.random()}`} message={msg} />
				) : (
					<IncomingMessage key={`${msg._id}-${msg.createdAt || Math.random()}`} message={msg} />
				)
							 )}
				{/* Referencia al último mensaje */}
				<div ref={messagesEndRef} />
			</MsgHistory>
			<MessageInputForm onSubmit={handleSubmit}>
				<MessageInput
					name="message"
					placeholder="Escribe un mensaje..."
					value={messageContent}
					onChange={(e) => setMessageContent(e.target.value)}
				/>
				{/* Botón para seleccionar archivos */}
				<label htmlFor="fileInput" style={{ cursor: 'pointer', fontSize: '24px', marginRight: '10px' }}>
					📎
				</label>
				<input
					id="fileInput"
					type="file"
					style={{ display: 'none' }} // Escondemos el input real
					onChange={(e) => {
						if (e.target.files) {
							setSelectedFile(e.target.files[0]);
						}
					}}
				/>
				<SendButton type="submit">➤</SendButton>
			</MessageInputForm>
		</MesgsContainer>
	);
};

