export interface ChatUser {
	_id: string;
	username: string;
	avatar?: string;
	profile?: {
		profilePicture?: string;
	};
}

export interface Group {
	_id: string;
	name: string;
	avatar?: string;
}

export interface Message {
	_id: string;
	sender: ChatUser;
	receiver: string | null;
	content: string;
	isGroupMessage: boolean;
	groupId?: string;
	isRead: boolean;
	createdAt: string;
	filePath?: string;
	fileType?: string;
}

export interface Conversation {
	id: string;
	name: string;
	isGroup: boolean;
	profilePicture?: string; // sólo usuarios
}

