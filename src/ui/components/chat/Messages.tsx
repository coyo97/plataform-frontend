import React from 'react';
import { IncomingMessage } from './IncomingMessage';
import { OutgoingMessage } from './OutgoingMessage';
import { SendMessage } from './SendMessage';

interface Message {
    _id: string;
    senderId: string;
    receiverId: string | null;
    content: string;
    isGroupMessage: boolean;
    groupId?: string;
	sender?: { username: string; profilePicture?: string };
    isRead: boolean;
    createdAt: string;
}

interface MessagesProps {
    messages: Message[];
    currentUserId: string;
    handleSendMessage: (messageContent: string) => void;
}

export const Messages: React.FC<MessagesProps> = ({ messages, currentUserId, handleSendMessage }) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const input = (event.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement;
        handleSendMessage(input.value);
        input.value = ''; // Clear the input
    };

    return (
        <div className="mesgs">
            <div className="msg_history">
                {messages.map((msg) =>
                    msg.senderId === currentUserId ? (
                        <OutgoingMessage key={`${msg._id}-${msg.createdAt}`} message={msg} />
                    ) : (
                        <IncomingMessage key={`${msg._id}-${msg.createdAt}`} message={msg} />
                    )
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="message" placeholder="Mensaje..." />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

