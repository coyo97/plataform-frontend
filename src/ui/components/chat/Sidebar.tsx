import React from 'react';
import { SidebarChatItem } from './SidebarChatItem';

interface User {
    _id: string;
    username: string;
    profilePicture?: string; // Añade este campo
}

interface Group {
    _id: string;
    name: string;
}

interface SidebarProps {
    users: User[];
    groups: Group[];
    currentChatId: string;
    onSelectUser: (userId: string) => void;
    onSelectGroup: (groupId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ users, groups, currentChatId, onSelectUser, onSelectGroup }) => {
    return (
        <div className="inbox_chat">
            <h5>Usuarios</h5>
            {users.map((user) => (
                <SidebarChatItem
                    key={user._id}
                    item={user}
                    isActive={user._id === currentChatId}
                    onClick={() => onSelectUser(user._id)}
                />
            ))}
            <h5>Grupos</h5>
            {groups.map((group) => (
                <SidebarChatItem
                    key={group._id}
                    item={{ _id: group._id, username: group.name }}
                    isActive={group._id === currentChatId}
                    onClick={() => onSelectGroup(group._id)}
                />
            ))}
        </div>
    );
};

