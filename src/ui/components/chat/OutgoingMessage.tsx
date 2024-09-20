import React from 'react';

import { OutgoingMsgContainer, SentMsg, TimeDate } from './outgoingMessage.styles';

interface MessageProps {
    message: {
        content: string;
        createdAt: string;
    };
}

export const OutgoingMessage: React.FC<MessageProps> = ({ message }) => {
    // Validar la fecha y formatearla solo si es válida
    const messageDate = new Date(message.createdAt);
    const formattedDate = isNaN(messageDate.getTime()) ? 'Fecha Inválida' : messageDate.toLocaleString();

 return (
        <OutgoingMsgContainer>
            <SentMsg>
                <p>{message.content}</p>
                <TimeDate>{formattedDate}</TimeDate>
            </SentMsg>
        </OutgoingMsgContainer>
    );
};

