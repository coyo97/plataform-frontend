import React from 'react';
import Text from '../../../../shared/atoms/typography/Text';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import { List, Item } from './conversationList.styles';

export interface Conversation {
	id      : string;
	name    : string;
	isGroup : boolean;
}

interface Props {
	data        : Conversation[];
	activeId   ?: string;
	onSelect    : (id: string, isGroup: boolean) => void;
}

const ConversationList: React.FC<Props> = ({ data, activeId, onSelect }) => (
	<SmartBox column p="px10" gap="px8" style={{ width: 260 }}>
		<Text as="h3" size="md" weight="bold">Chats</Text>

		<List>
			{data.map(c => (
				<Item
					key={c.id}
					active={c.id === activeId}
					onClick={() => onSelect(c.id, c.isGroup)}
				>
					{c.name}
				</Item>
			))}
		</List>
	</SmartBox>
);

export default ConversationList;

