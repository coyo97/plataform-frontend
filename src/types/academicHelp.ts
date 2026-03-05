export interface AcademicHelp {
	_id: string;

	// Catálogos (pueden llegar como string o poblados según populate)
	facultyId?: string | { _id: string; name?: string };
	careerId : string | { _id: string; name?: string };
	cycleId? : string | { _id: string; name?: string };
	subjectId?: string | { _id: string; name?: string; code?: string };
	unitId?  : string | { _id: string; name?: string };

	// Legacy (compatibilidad)
	faculty? : string;
	semester?: string;
	subject? : string;

	topic?: string;
	description?: string;
	fileUrl?: string;

	type: 'need_help' | 'offer_help';
	status: 'open' | 'resolved';

	created_at: string;
	updated_at: string;
	  messagesCount?: number;
  votesCount?: number;

	user?: {
		_id: string;
		username: string;
		profile?: {
			profilePicture?: string;
		};
	};
}

