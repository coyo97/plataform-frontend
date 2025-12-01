export interface Notification {
	_id: string;
	recipient: string;
	sender: string;
	type: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	data?: {
		publicationId?: string;
		commentId?: string;
		groupId?: string; 
	};
	group?: { _id?: string; name?: string };
}

