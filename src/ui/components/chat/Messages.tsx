import React, { useRef, useEffect } from 'react';
import { IncomingMessage } from './IncomingMessage';
import { OutgoingMessage } from './OutgoingMessage';
import { SendMessage } from './SendMessage';

import { MesgsContainer, MsgHistory, MessageInput, SendButton, MessageInputForm } from './message.styles';

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
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Referencia para el último mensaje

    // Función para desplazarse al último mensaje
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Efecto que se ejecuta cuando los mensajes cambian
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const input = (event.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement;
        handleSendMessage(input.value);
        input.value = ''; // Limpiar el input después de enviar el mensaje
    };

    return (
        <MesgsContainer>
            <MsgHistory>
                {messages.map((msg) =>
                    msg.senderId === currentUserId ? (
                        <OutgoingMessage key={`${msg._id}-${msg.createdAt || Math.random()}`} message={msg} />
                    ) : (
                        <IncomingMessage key={`${msg._id}-${msg.createdAt || Math.random()}`} message={msg} />
                    )
                )}
                {/* Referencia al último mensaje */}
                <div ref={messagesEndRef} />
            </MsgHistory>
            <MessageInputForm onSubmit={handleSubmit}>
                <MessageInput type="text" name="message" placeholder="Escribe un mensaje..." />
                <SendButton type="submit">Enviar</SendButton>
            </MessageInputForm>
        </MesgsContainer>
    );
};

