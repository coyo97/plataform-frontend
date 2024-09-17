// src/ui/components/chat/ChatSelect.tsx
import React from 'react';

export const ChatSelect: React.FC = () => {
    return (
        <div className="middle-screen">
            <div className="alert alert-info text-center">
                <hr />
                <h3>Seleccione una conversación</h3>
                <span>Para comenzar una conversación, selecciona un usuario o un grupo en el panel lateral.</span>
            </div>
        </div>
    );
};

export default ChatSelect;

