// src/ui/components/chat/ChatSelect.tsx
import React from 'react';

import { ChatSelectContainer, AlertBox, AlertTitle, AlertMessage } from './chatSelect.styles';

export const ChatSelect: React.FC = () => {
	return (
        <ChatSelectContainer>
            <AlertBox>
                <hr />
                <AlertTitle>Seleccione una conversación</AlertTitle>
                <AlertMessage>
                    Para comenzar una conversación, selecciona un usuario o un grupo en el panel lateral.
                </AlertMessage>
            </AlertBox>
        </ChatSelectContainer>
    );
};

export default ChatSelect;

