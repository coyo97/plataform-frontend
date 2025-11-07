// ui/components/chat/InboxPeople.tsx
import React, { useState, useEffect } from 'react';
import { InboxPeopleContainer } from './inboxPeoble.styles';
import { Sidebar } from './Sidebar';

interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
	profilePicture?: string; // por compatibilidad
}
interface Group {
	_id: string;
	name: string;
}
export type ConversationItem = {
	peer: {
		_id: string;
		username: string;
		// puede venir plano o anidado según endpoint
		profile?: { profilePicture?: string };
		profilePicture?: string;
	};
	lastMessageAt: string | null;
	lastMessage?: { content?: string } | null;
	unreadCount: number;
	pinned?: boolean;
	muted?: boolean;
};

interface InboxPeopleProps {
	users: User[];
	groups: Group[];
	conversations?: ConversationItem[];
	currentChatId: string;
	onSelectUser: (userId: string) => void;
	onSelectGroup: (groupId: string) => void;
	isFloating?: boolean;
	showUserList: boolean;
	toggleUserList: () => void;
	onlineSet?: Set<string>;
}

export const InboxPeople: React.FC<InboxPeopleProps> = ({
	users,
	groups,
	conversations = [],
	currentChatId,
	onSelectUser,
	onSelectGroup,
	isFloating = false,
	showUserList,
	toggleUserList,
	onlineSet,
}) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => setIsMobile(isFloating || window.innerWidth <= 768);
		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, [isFloating]);

	const handleSelect = (id: string, isGroup: boolean) => {
		if (isGroup) onSelectGroup(id);
		else onSelectUser(id);
		if (isMobile || isFloating) toggleUserList();
	};

	return (
		<>
			{(isMobile || isFloating) && (
				<button
					onClick={toggleUserList}
					style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
				>
					{showUserList ? '⬅ Ocultar' : '➡ Mostrar'}
				</button>
			)}

			{showUserList && (
				<InboxPeopleContainer
					showUserList={showUserList}
					isMobile={isMobile}
					isFloating={isFloating}
				>
					<Sidebar
						users={users}
						groups={groups}
						conversations={conversations}
						currentChatId={currentChatId}
						onSelectUser={(userId) => handleSelect(userId, false)}
						onSelectGroup={(groupId) => handleSelect(groupId, true)}
						onlineSet={onlineSet}
					/>
				</InboxPeopleContainer>
			)}
		</>
	);
};

