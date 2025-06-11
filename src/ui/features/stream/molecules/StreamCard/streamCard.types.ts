// src/ui/features/stream/molecules/StreamCard/streamCard.types.ts
export interface StreamCardProps {
	id: string;
	title: string;
	visibility: 'university' | 'career' | 'private';
	viewerCount: number;
	thumbnailUrl?: string;
	isLive: boolean;
	onClick?: () => void;
	dense?: boolean; // ZZ
	description?: string;
}

