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
};

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
	socket: Socket | undefined,
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
	chatIdRef: React.MutableRefObject<string>,
): () => void => {
	const onNew = (msg: Message) => {
		const id = chatIdRef.current;

		console.log('[WS][MESSAGE_NEW] incoming', {
			msgId: msg._id,
			isGroupMessage: msg.isGroupMessage,
			groupId: (msg as any).groupId,
			senderId: msg.sender?._id,
			receiver: (msg as any).receiver,
			currentChatId: id,
		});

		const matches =
			msg.sender._id === id ||
			(msg as any).receiver === id ||
			(msg.isGroupMessage && (msg as any).groupId === id);

		if (!matches) {
			console.log('[WS][MESSAGE_NEW] ignored (not for current chat)');
			return;
		}

		console.log('[WS][MESSAGE_NEW] matches current chat → candidate to push');

		const msgWithStatus: any = {
			...msg,
			status: (msg as any).status ?? 'sent',   
		};

		setMessages(prev => {
			const already = prev.some(m => m._id === msg._id);

			if (already) {
				console.log(
					'[WS][MESSAGE_NEW] SKIP duplicate message',
					{ msgId: msg._id, prevLength: prev.length },
				);
				return prev;
			}

			const next = [...prev, msg];
			console.log('[WS][MESSAGE_NEW] PUSH new message', {
				msgId: msg._id,
				prevLength: prev.length,
				nextLength: next.length,
			});
			return next;
		});
	};

	const onDelete = ({ messageId }: { messageId: string }) => {
		console.log('[WS][MESSAGE_DELETE] incoming', { messageId });
		setMessages(prev => {
			const next = prev.filter(m => m._id !== messageId);
			console.log('[WS][MESSAGE_DELETE] after delete', {
				prevLength: prev.length,
				nextLength: next.length,
			});
			return next;
		});
	};

	if (!socket) {
		console.warn('[WS][MESSAGE_EVENTS] socket is null, no listeners registered');
		return () => {};
	}

	console.log('[WS][MESSAGE_EVENTS] registering listeners', {
		currentChatId: chatIdRef.current,
	});

	socket.on(WS_EVENTS.MESSAGE_NEW, onNew);
	socket.on(WS_EVENTS.MESSAGE_DELETE, onDelete);

	return () => {
		console.log('[WS][MESSAGE_EVENTS] unregistering listeners');
		socket.off(WS_EVENTS.MESSAGE_NEW, onNew);
		socket.off(WS_EVENTS.MESSAGE_DELETE, onDelete);
	};
};


export const searchMessages = (
	chatId: string,
	isGroup: boolean,
	query: string,
	skip = 0,
	limit = 20,
) =>
	get<{ messages: Message[] }>(
		URL(`${BASE}/search`),
		{
			chatId,
			isGroup,
			q: query,
			skip,
			limit,
		},
	).then(r => r.messages);

