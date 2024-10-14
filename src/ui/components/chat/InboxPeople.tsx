import React, { useState, useEffect } from 'react';
import { Searchbox } from './Searchbox';
import { Sidebar } from './Sidebar';
import { InboxPeopleContainer } from './inboxPeoble.styles';

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
    const [showUserList, setShowUserList] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    const toggleUserList = () => {
        if (!showUserList) {
            // Si está en móvil y se desea mostrar la lista de usuarios, recargar la página
            window.location.reload();
        } else {
            setShowUserList(!showUserList);
        }
    };

    return (
        <InboxPeopleContainer>
            {isMobile && (
                <button onClick={toggleUserList}>
                    {showUserList ? '⬇ Ocultar' : '⬅ Mostrar'}
                </button>
            )}

            {showUserList ? (
                <>
                    <Searchbox />
                    <Sidebar
                        users={users}
                        groups={groups}
                        currentChatId={currentChatId}
                        onSelectUser={(userId) => {
                            onSelectUser(userId);
                            if (isMobile) setShowUserList(false);
                        }}
                        onSelectGroup={(groupId) => {
                            onSelectGroup(groupId);
                            if (isMobile) setShowUserList(false);
                        }}
                    />
                </>
            ) : null}
        </InboxPeopleContainer>
    );
};

