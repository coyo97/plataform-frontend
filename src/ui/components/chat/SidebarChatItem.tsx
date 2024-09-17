import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

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
        <div className={`chat_list ${isActive ? 'active_chat' : ''}`} onClick={onClick}>
            <div className="chat_people">
                <div className="chat_img">
                    <img src={profilePictureUrl} alt={item.username} />
                </div>
                <div className="chat_ib">
                    <h5>{item.username}</h5>
                </div>
            </div>
        </div>
    );
};

