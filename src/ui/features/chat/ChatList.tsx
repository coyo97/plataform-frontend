import React from 'react';

import { ChatListContainer,ChatTitle, ChatListItem } from './chatList.styles';

interface ChatListProps {
  chats: Array<{ id: string; name: string; isGroup: boolean }>;
  onSelectChat: (id: string, isGroup: boolean) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
	 return (
    <ChatListContainer>
      <ChatTitle>Chats</ChatTitle>
      <ul>
        {chats.map((chat) => (
          <ChatListItem key={chat.id} onClick={() => onSelectChat(chat.id, chat.isGroup)}>
            {chat.name}
          </ChatListItem>
        ))}
      </ul>
    </ChatListContainer>
  );
};

export default ChatList;

