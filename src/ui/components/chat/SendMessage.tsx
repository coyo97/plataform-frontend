import React, { useState } from 'react';

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
        <form onSubmit={onSubmit}>
            <div className="type_msg row">
                <div className="input_msg_write col-sm-9">
                    <input
                        type="text"
                        className="write_msg"
                        placeholder="Mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="col-sm-3 text-center">
                    <button className="msg_send_btn mt-3" type="submit">
                        Enviar
                    </button>
                </div>
            </div>
        </form>
    );
};

