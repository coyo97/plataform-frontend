import { Message } from '../../../../../types/chat';

export interface MessageHistoryProps {
	messages      : Message[];
	currentUserId : string;
	onSend        : (txt: string)=>void;
	onSendFile    : (file: File, txt?: string)=>void;
	onDelete      : (id:string)=>void;
	loadMore      : ()=>void;
	hasMore       : boolean;
}

