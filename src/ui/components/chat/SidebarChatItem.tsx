import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

import { ChatListItem, ChatPeople, ChatImage, ChatInfo } from './sidebarChatItem.styles';

interface User {
    _id: string;
    username: string;
    profilePicture?: string;
}

interface SidebarChatItemProps {
    item: User;
    isActive: boolean;
    onClick: () => void;
}

export const SidebarChatItem: React.FC<SidebarChatItemProps> = ({ item, isActive, onClick }) => {
    const { HOST } = getEnvVariables();

    const profilePictureUrl = item.profilePicture 
        ? `${HOST}/${item.profilePicture}` 
        : 'https://ptetutorials.com/images/user-profile.png';

		 return (
        <ChatListItem isActive={isActive} onClick={onClick}>
            <ChatPeople>
                <ChatImage src={profilePictureUrl} alt={item.username} />
                <ChatInfo>
                    <h5>{item.username}</h5>
                </ChatInfo>
            </ChatPeople>
        </ChatListItem>
    );
};

