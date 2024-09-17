import React from 'react';

interface ChatListProps {
  chats: Array<{ id: string; name: string; isGroup: boolean }>;
  onSelectChat: (id: string, isGroup: boolean) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="chat-list">
      <h3>Chats</h3>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => onSelectChat(chat.id, chat.isGroup)}>
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;

