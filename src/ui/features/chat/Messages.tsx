import React, { useRef, useEffect, useState } from 'react';
import { IncomingMessage } from './IncomingMessage';
import { OutgoingMessage } from './OutgoingMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
	MesgsContainer,
	MsgHistory,
	MessageInput,
	SendButton,
	MessageInputForm,
} from './message.styles';

import { Message } from '../../../types/types';

interface MessagesProps {
	messages: Message[];
	currentUserId: string;
	handleSendMessage: (
		messageContent: string,
		selectedFile?: File | null | undefined
	) => Promise<void>;
	handleDeleteMessage: (messageId: string) => void;
	loadMoreMessages: () => void;
	hasMoreMessages: boolean;
}

export const Messages: React.FC<MessagesProps> = ({
	messages,
	currentUserId,
	handleSendMessage,
	handleDeleteMessage,
	loadMoreMessages,
	hasMoreMessages,
}) => {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const scrollableDivRef = useRef<HTMLDivElement | null>(null);
	const [messageContent, setMessageContent] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const messageInputRef = useRef<HTMLTextAreaElement>(null);


	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleSendMessage(messageContent, selectedFile);
		setMessageContent('');
		setSelectedFile(null);

		// Restablecer el valor del input de archivo
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}

		// Enfocar de nuevo en el input de mensaje
		if (messageInputRef.current) {
			messageInputRef.current.focus();
		}
	};

	const handleDeleteMessageLocal = (messageId: string) => {
		handleDeleteMessage(messageId);
	};

	// Función para ordenar mensajes por fecha
	const sortMessagesByDate = (messagesArray: Message[]) => {
		return messagesArray.sort(
			(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		);
	};

	useEffect(() => {
		if (messagesEndRef.current && messages.length > 0) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	return (
		<MesgsContainer>
			<div
				id="scrollableDiv"
				style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}
				ref={scrollableDivRef}
			>
				<InfiniteScroll
					dataLength={messages.length}
					next={loadMoreMessages}
					hasMore={hasMoreMessages}
					inverse={true}
					loader={<h4>Cargando más mensajes...</h4>}
					scrollableTarget="scrollableDiv"
					scrollThreshold={0.9}
				>
					<MsgHistory>
						{sortMessagesByDate(messages).map((msg) =>
														  msg.sender._id === currentUserId ? (
															  <OutgoingMessage
																  key={msg._id}
																  message={msg}
																  onDeleteMessage={handleDeleteMessageLocal}
															  />
						) : (
							<IncomingMessage
								key={msg._id}
								message={msg}
							/>
						)
														 )}
						<div ref={messagesEndRef} />
					</MsgHistory>
				</InfiniteScroll>
			</div>
			<MessageInputForm onSubmit={handleSubmit}>
				<MessageInput
					ref={messageInputRef} // Añadido
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

