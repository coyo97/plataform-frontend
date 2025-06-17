import { useEffect, useState } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';

interface ChatMessage {
	senderId: string;
	username?: string;
	profilePicture?: string;
	content: string;
	timestamp: number;
	fromUserId?: string;
	toUserId?: string;
}

export function useStreamChat(streamId: string) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const socket = useSocket();

	useEffect(() => {
		const handler = (msg: ChatMessage) => {
			// Puedes agregar lógica para ocultar mensajes privados que no te involucren
			setMessages(prev => [...prev, msg]);
		};

		socket.on('stream-chat-message', handler);

		// cleanup
		return () => {
			socket.off('stream-chat-message', handler);
		};
	}, [streamId, socket]);

	const sendMessage = (content: string, toUserId?: string) => {
		socket.emit('stream-chat-message', {
			streamId,
			content,
			toUserId,
		});
	};

	return { messages, sendMessage };
}

