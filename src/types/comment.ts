export interface Comment {
	_id        : string;
	content    : string;
	author     : { _id: string; username: string };
	publication: string;
	created_at : string;
}

