// ui/features/chat/atoms/MessageBubble/outgoingBubble.types.ts
import type { Message } from '../../../../../types/chat';

export interface OutgoingBubbleProps {
	msg: Message;
	onDelete?: (id: string) => void;
}

