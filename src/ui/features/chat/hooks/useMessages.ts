import { useEffect, useState } from 'react';
import {
	fetchMessages, sendMessage, sendFileMessage, deleteMessage
} from '../../../../async/services/chatService';
import { useChatSocket } from './useChatSocket';
import { Message } from '../../../../types/chat';

export const useMessages = (chatId:string, isGroup:boolean) => {
	const [list,    setList   ] = useState<Message[]>([]);
	const [busy,    setBusy   ] = useState(false);
	const [more,    setMore   ] = useState(true);

	/* reinicio cuando cambia chat */
	useEffect(() => { setList([]); setMore(true); }, [chatId]);

	/* tiempo-real */
	useChatSocket(
		m  => (m.receiver===chatId || m.groupId===chatId) && setList(p=>[...p,m]),
		id => setList(p=>p.filter(x=>x._id!==id)),
	);

	const loadMore = async () => {
		if (busy || !more) return;
		setBusy(true);
		const page = await fetchMessages(chatId, isGroup, list.length);
		setMore(page.length>=20);
		setList(p => [...page, ...p]);
		setBusy(false);
	};

	return {
		list,
		more,
		loadMore,
		send      : sendMessage,
		sendFile  : sendFileMessage,
		remove    : deleteMessage,
	};
};

