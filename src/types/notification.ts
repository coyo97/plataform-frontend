export interface NotificationData {
	publicationId?: string;
	commentId?: string;

	groupId?: string;
	groupName?: string;

	streamId?: string;
	visibility?: string;
	careerIds?: string[];

	helpId?: string;
	threadId?: string;
	messageId?: string;
	voteCount?: number;
}

export interface Notification {
	_id: string;
	recipient: string;
	sender: string;
	type: string;
	message: string;
	isRead: boolean;
	createdAt: string;

	data?: NotificationData;

	//  solo usado para "group_added" antes,
	// puedes mantenerlo para compatibilidad.
	group?: { _id?: string; name?: string };
}

