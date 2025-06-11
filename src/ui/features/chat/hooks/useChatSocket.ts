import { useEffect } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import { CHAT_EVENTS } from '../../../../utils/socket/events';
import { Message } from '../../../../types/chat';

export const useChatSocket = (onNew: (m: Message)=>void, onDelete: (id:string)=>void) => {
	const socket = useSocket();

	useEffect(() => {
		socket.on(CHAT_EVENTS.MESSAGE_NEW, onNew);
		socket.on(CHAT_EVENTS.MESSAGE_DELETE, ({ messageId }) => onDelete(messageId));
		return () => {
			socket.off(CHAT_EVENTS.MESSAGE_NEW, onNew);
			socket.off(CHAT_EVENTS.MESSAGE_DELETE);
		};
	}, [socket, onNew, onDelete]);

	return socket;
};

