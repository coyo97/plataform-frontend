export interface AcademicHelp {
	_id: string;
	faculty?: string;
	careerId: string;
	semester?: string;
	subject?: string;        // ← opcional
	topic?: string;
	description?: string;    // ← opcional
	fileUrl?: string;        // ← necesario para preview
	type: 'need_help' | 'offer_help';
	status: 'open' | 'resolved';
	created_at: string;
	updated_at: string;
	user?: {
		_id: string;
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};

}

