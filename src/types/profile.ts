// src/types/profile.ts

export interface UserProfile {
	_id: string;
	username: string;
	email: string;
	bio?: string;
	interests?: string[];
	profilePicture?: string;
	isFriend?: boolean;
	hasSentRequest?: boolean;
	hasReceivedRequest?: boolean;
}

