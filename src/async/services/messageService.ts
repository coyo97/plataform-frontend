import { get, post, del } from '../api';
import { Socket } from 'socket.io-client';
import { Message } from '../../types/types';
import getEnvVariables from '../../config/configEnvs';


const { HOST, SERVICE } = getEnvVariables();
const URL = (p: string) => `${HOST}${SERVICE}${p}`;

const BASE = '/messages';

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

/** Registra listeners y devuelve cleanup. */
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

