// ConversationItem.tsx
import React from 'react';
import AvatarX from '../../../../shared/atoms/avatar/AvatarX';
import { Item, Name } from './conversationItem.styles';
import type { ConversationItemProps } from './conversationItem.types';

const ConversationItem:React.FC<ConversationItemProps> = ({
	id, name, avatarUrl, active, onSelect
}) => (
	<Item key={id} active={active} onClick={onSelect}>
		<AvatarX src={avatarUrl} size="sm" />
		<Name>{name}</Name>
	</Item>
);

export default ConversationItem;

