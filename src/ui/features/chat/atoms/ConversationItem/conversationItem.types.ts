// conversationItem.types.ts
export interface ConversationItemProps {
	id        : string;
	name      : string;
	avatarUrl?: string;
	active   ?: boolean;
	onSelect  : () => void;
}

