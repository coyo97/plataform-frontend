import React from 'react';
import MessageHistory from '../MessageHistory/MessageHistory';
import SendBox        from '../SendBox/SendBox';     // ↓ definido más adelante
import { Message } from '../../../../../types/chat';

interface Props {
	list: Message[];
	hasMore : boolean;
	loadMore: () => void;

	send    : (id: string, txt: string, isGroup: boolean) => Promise<void>;
	sendFile: (id: string, f: File, isGroup: boolean)     => Promise<void>;
	remove  : (id: string) => Promise<void>;

	currentUserId: string;
	chatId : string;
	isGroup: boolean;
}

const MessagePanel: React.FC<Props> = ({
	list, hasMore, loadMore,
	send, sendFile, remove,
	currentUserId, chatId, isGroup,
}) => (
	<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
		{/*<MessageHistory
			messages={list}
			currentUserId={currentUserId}
			loadMore={loadMore}
			hasMore={hasMore}
			onDelete={remove}
			/> */}

		<SendBox
			onSend={txt  => send    (chatId, txt, isGroup)}
			onFile={file => sendFile(chatId, file, isGroup)}
		/>
	</div>
);

export default MessagePanel;

