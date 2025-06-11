export interface Report {
	_id: string;
	reporter: { _id: string; username: string };
	publication: {
		_id: string;
		title: string;
		author: { _id: string; username: string };
	} | null;
	reason: string;
	status: "pending" | "reviewed" | "dismissed";
	createdAt: string;
	updatedAt: string;
}

