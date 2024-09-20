import React from 'react';
import { Searchbox } from './Searchbox';
import { Sidebar } from './Sidebar';

import { InboxPeopleContainer, } from './inboxPeoble.styles';

interface User {
    _id: string;
    username: string;
}

interface Group {
    _id: string;
    name: string;
}

interface InboxPeopleProps {
    users: User[];
    groups: Group[];
    currentChatId: string;
    onSelectUser: (userId: string) => void;
    onSelectGroup: (groupId: string) => void;
}

export const InboxPeople: React.FC<InboxPeopleProps> = ({
    users,
    groups,
    currentChatId,
    onSelectUser,
    onSelectGroup,
}) => {
return (
        <InboxPeopleContainer>
            <Searchbox />
            <Sidebar
                users={users}
                groups={groups}
                currentChatId={currentChatId}
                onSelectUser={onSelectUser}
                onSelectGroup={onSelectGroup}
            />
        </InboxPeopleContainer>
    );
};
