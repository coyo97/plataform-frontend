// src/ui/components/chat/ChatSelect.tsx
import React from 'react';

import { ChatSelectContainer, AlertBox, AlertTitle, AlertMessage } from './chatSelect.styles';

export const ChatSelect: React.FC = () => {
	return (
        <ChatSelectContainer>
            <AlertBox>
                <hr />
                <AlertTitle></AlertTitle>
                <AlertMessage>
                </AlertMessage>
            </AlertBox>
        </ChatSelectContainer>
    );
};

export default ChatSelect;

