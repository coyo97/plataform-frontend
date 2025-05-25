// src/types/stream.ts
export type Visibility = 'university' | 'career' | 'private';

export interface Stream {
	_id:          string;
	title:        string;
	userId:       string;
	streamKey:    string;
	active:       boolean;
	isScreenSharing: boolean;

	visibility:   Visibility;
	careerIds?:   string[];
	accessCode?:  string;

	thumbnailUrl?: string;
	viewerCount:   number;
	scheduledAt?:  string;     // ISO date
	endedAt?:      string;     // ISO date
	recordingUrl?: string;

	tags?:        string[];
	description?: string;

	likes:        string[];    // userIds
	chatId?:      string;

	createdAt:    string;
	updatedAt:    string;
}

