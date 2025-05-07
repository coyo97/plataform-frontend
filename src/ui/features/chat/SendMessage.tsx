import React, { useState } from 'react';

import { FormContainer, InputMsgWrite, MsgSendBtn } from './sendMessage.styles';

interface SendMessageProps {
    handleSendMessage: (messageContent: string) => void;
}

export const SendMessage: React.FC<SendMessageProps> = ({ handleSendMessage }) => {
    const [message, setMessage] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() !== '') {
            handleSendMessage(message);
            setMessage('');
        }
    };

return (
        <FormContainer onSubmit={onSubmit}>
            <InputMsgWrite
                type="text"
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <MsgSendBtn type="submit">Enviar</MsgSendBtn>
        </FormContainer>
    );
};

