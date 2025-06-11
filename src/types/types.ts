export interface Message {
	_id: string;
	sender: { _id: string; username: string; profile?: { profilePicture?: string } };
	receiver: string | null;
	content: string;
	isGroupMessage: boolean;
	groupId?: string;
	isRead: boolean;
	createdAt: string;
	filePath?: string;
	fileType?: string;
}

export interface Group {
	_id: string;
	name: string;
}

export interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
}

