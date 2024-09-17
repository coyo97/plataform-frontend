import React from 'react';

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
        <div className="outgoing_msg">
            <div className="sent_msg">
                <p>{message.content}</p>
                <span className="time_date">{formattedDate}</span>
            </div>
        </div>
    );
};

