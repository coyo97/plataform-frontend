export interface HelpMessage {
	_id: string;
	author: {
		_id: string;
		username: string;
		profile?: { profilePicture?: string };
	};
	content: string;
	votes: number;
	created_at: string;
}

export interface HelpThread {
	_id: string;
	helpId: string;
	messages: HelpMessage[];
	solvedMessage?: string;
}

