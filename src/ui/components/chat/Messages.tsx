// Messages.tsx
import React, { useRef, useEffect, useState } from 'react';
import { IncomingMessage } from './IncomingMessage';
import { OutgoingMessage } from './OutgoingMessage';


import {
	MesgsContainer,
	MsgHistory,
	MessageInput,
	SendButton,
	MessageInputForm,
} from './message.styles';

interface Message {
	_id: string;
	sender: {
		_id: string;
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};
	receiver: string | null;
	content: string;
	isGroupMessage: boolean;
	groupId?: string;
	isRead: boolean;
	createdAt: string;
	filePath?: string;
	fileType?: string;
}

interface MessagesProps {
	messages: Message[];
	currentUserId: string;
	handleSendMessage: (
		messageContent: string,
		selectedFile?: File | null | undefined
	) => Promise<void>;
}

export const Messages: React.FC<MessagesProps> = ({
	messages,
	currentUserId,
	handleSendMessage,
}) => {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const [messageContent, setMessageContent] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);


	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleSendMessage(messageContent, selectedFile);
		setMessageContent('');
		setSelectedFile(null);

		// Restablecer el valor del input de archivo
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<MesgsContainer>
			<MsgHistory>
				{messages.map((msg) =>
							  msg.sender._id === currentUserId ? (
								  <OutgoingMessage
									  key={`${msg._id}-${msg.createdAt || Math.random()}`}
									  message={msg}
								  />
				) : (
					<IncomingMessage
						key={`${msg._id}-${msg.createdAt || Math.random()}`}
						message={msg}
					/>
				)
							 )}
				<div ref={messagesEndRef} />
			</MsgHistory>
			<MessageInputForm onSubmit={handleSubmit}>
				<MessageInput
					name="message"
					placeholder="Escribe un mensaje..."
					value={messageContent}
					onChange={(e) => setMessageContent(e.target.value)}
				/>
				<label
					htmlFor="fileInput"
					style={{ cursor: 'pointer', fontSize: '24px', marginRight: '10px' }}
				>
					📎
				</label>
				<input
					ref={fileInputRef}
					id="fileInput"
					type="file"
					style={{ display: 'none' }}
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

