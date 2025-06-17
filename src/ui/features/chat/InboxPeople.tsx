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
	isFloating?: boolean; // Nueva propiedad
	showUserList: boolean; // Nueva propiedad
	toggleUserList: () => void; // Nueva propiedad
}

export const InboxPeople: React.FC<InboxPeopleProps> = ({
	users,
	groups,
	currentChatId,
	onSelectUser,
	onSelectGroup,
	isFloating = false, // Valor por defecto
	showUserList,
	toggleUserList,
}) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			if (isFloating) {
				setIsMobile(true); // Siempre considerar como móvil si es flotante
			} else {
				setIsMobile(window.innerWidth <= 768);
			}
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);

		return () => {
			window.removeEventListener('resize', checkIsMobile);
		};
	}, [isFloating]);

	const handleSelect = (id: string, isGroup: boolean) => {
		if (isGroup) {
			onSelectGroup(id);
		} else {
			onSelectUser(id);
		}
		if (isMobile || isFloating) {
			toggleUserList(); // Ocultar la lista al seleccionar
		}
	};
	return (
		<>
			{(isMobile || isFloating) && (
				<button
					onClick={toggleUserList}
					style={{
						position: 'absolute',
						top: 10,
						left: 10,
						zIndex: 1000,
					}}
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
					{/*	<Searchbox />*/}
					<Sidebar
						users={users}
						groups={groups}
						currentChatId={currentChatId}
						onSelectUser={(userId) => handleSelect(userId, false)}
						onSelectGroup={(groupId) => handleSelect(groupId, true)}
					/>
				</InboxPeopleContainer>
			)}
		</>
	);
};

