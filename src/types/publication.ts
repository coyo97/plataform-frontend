export interface Career {
	_id: string;
	name: string;
}

export interface Publication {
	_id: string;
	title: string;
	content: string;
	tags?: string[];
	filePath?: string;
	fileType?: string;
	likes?: string[];
	commentsCount?: number;

	author: {
		_id: string;
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};
}

