// src/async/services/messageService.ts
import { get, post, del } from '../api';
import { Socket } from 'socket.io-client';
import { Message } from '../../types/types';
import getEnvVariables from '../../config/configEnvs';

const { HOST, SERVICE } = getEnvVariables();
const URL = (p: string) => `${HOST}${SERVICE}${p}`;

const BASE = '/messages';

/* ===== Tipos auxiliares ===== */
export type PeerSummary = {
	_id: string;
	username: string;
	profile?: any;
};

export type ConversationSummary = {
	peer: PeerSummary;
	lastMessageAt: string | null;
	lastMessage?: {
		content?: string;
		createdAt?: string;
		sender?: any;
		filePath?: string;
		fileType?: string;
	} | null;
	unreadCount: number;
	// Si en el futuro mezclas DMs y grupos puedes añadir flags aquí
};

/* ---------- HTTP ---------- */
export const fetchMessages = (
	chatId: string,
	isGroup: boolean,
	skip = 0,
	limit = 10,
) =>
	get<{ messages: Message[] }>(
		URL(`${BASE}/${isGroup ? 'group' : 'user'}/${chatId}`),
		{ skip, limit },
);

/** Conversaciones (solo amigos) ordenadas por último mensaje DESC */
export const fetchConversations = (skip = 0, limit = 30) =>
	get<{ conversations: ConversationSummary[] }>(
		URL(`${BASE}/conversations`),
		{ skip, limit },
).then(r => r.conversations);

/** Top de conversaciones con mensajes no leídos (resumen rápido) */
export const fetchUnreadConversations = () =>
	get<{ conversations: Array<{
	_id: string;
	isGroup: false;
	lastMessage: string;
	createdAt: string;
	unread: number;
	user: PeerSummary;
}> }>(
	URL(`${BASE}/unread`)
).then(r => r.conversations);

	/** Marcar un mensaje como leído */
	export const markMessageAsRead = (messageId: string) =>
		post<{ message: Message }>(URL(`${BASE}/mark-as-read`), { messageId })
	.then(r => r.message);

	export const sendFileMessage = (fd: FormData) =>
		post<{ message: Message }>(URL(`${BASE}/send-with-file`), fd, true)
	.then(r => r.message);

	export const deleteMessage = (id: string) =>
		del<void>(URL(`${BASE}/${id}`));

		/* ---------- WebSocket ---------- */
		const WS_EVENTS = {
			MESSAGE_NEW   : 'receive-message',
			MESSAGE_DELETE: 'message-deleted',
		} as const;

		export const sendMessage = (
			socket: Socket,
			payload: {
				senderId: string;
				receiverId?: string;
				groupId?: string;
				content: string;
				isGroupMessage: boolean;
			},
		) => {
			socket.emit('send-message', payload);
		};

		export const registerMessageEvents = (
			socket: Socket,
			setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
			chatIdRef: React.MutableRefObject<string>,
		): () => void => {
			const onNew = (msg: Message) => {
				const id = chatIdRef.current;
				if (
					msg.sender._id === id ||
					msg.receiver === id ||
				(msg.isGroupMessage && msg.groupId === id)
				) {
					setMessages(prev => [...prev, msg]);
				}
			};

			const onDelete = ({ messageId }: { messageId: string }) =>
				setMessages(prev => prev.filter(m => m._id !== messageId));

			socket.on(WS_EVENTS.MESSAGE_NEW, onNew);
			socket.on(WS_EVENTS.MESSAGE_DELETE, onDelete);

			return () => {
				socket.off(WS_EVENTS.MESSAGE_NEW, onNew);
				socket.off(WS_EVENTS.MESSAGE_DELETE, onDelete);
			};
		};

