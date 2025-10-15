// Chat.tsx
import React, { useState, useEffect } from 'react';
import { InboxPeople } from './InboxPeople';
import { Messages } from './Messages';
import { ChatSelect } from './ChatSelect';
import { MessagingContainer, InboxMsg } from './ChatStyles';
import { useMessages } from './hooks/useMessage';
import { useSocket } from '../../providers/SocketProvider';
import { sendMessage, sendFileMessage, deleteMessage as delMsg } from '../../../async/services/messageService';
import { get } from '../../../async/api';
import getEnvVariables from '../../../config/configEnvs';
import type { User, Group, Message } from '../../../types/types';
import { Box } from '@mui/material';

import Header from '../../shared/organisms/header/Header';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { NavLink, navLinks } from '../../../config/navLinks';
import SearchInput from '../../shared/molecules/searchInput';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import { userHasAdminRole } from '../../../utils/auth/getUserId';



interface ChatProps {
	userId: string;
	isFloating?: boolean;
}

const Chat: React.FC<ChatProps> = ({ userId, isFloating = false }) => {
	const [currentChatId, setCurrentChatId] = useState('');
	const [isGroupMessage, setIsGroupMessage] = useState(false);
	const [groups, setGroups] = useState<Group[]>([]);
	const [users, setUsers]   = useState<User[]>([]);
	const [showUserList, setShowUserList] = useState(true);

	const { messages, setMessages, loadMore, hasMore } =
		useMessages(currentChatId, isGroupMessage);

	const socket = useSocket();
	const { HOST, SERVICE } = getEnvVariables();

	/* sidebar toggle */
	const toggleUserList = () => setShowUserList(prev => !prev);

	/* cargar amigos y grupos */
	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const { friends } = await get<{ friends: User[] }>(`${HOST}${SERVICE}/users/friends`, {});
				setUsers(friends.filter(u => u._id !== userId));

				const { groups } = await get<{ groups: Group[] }>(`${HOST}${SERVICE}/groups`, {});
				setGroups(groups);
			} catch (e) { console.error('Error cargando contactos', e); }
		};
		fetchContacts();
	}, [HOST, SERVICE, userId]);

	/* enviar mensaje (texto o archivo) */
	const handleSend = async (content: string, file?: File | null) => {
		if ((!content.trim() && !file) || !currentChatId) return;

		if (file) {
			const fd = new FormData();
			fd.append('content', content);
			fd.append('receiverId', isGroupMessage ? '' : currentChatId);
			fd.append('isGroupMessage', String(isGroupMessage));
			if (isGroupMessage) fd.append('groupId', currentChatId);
			fd.append('file', file);

			try {
				const saved = await sendFileMessage(fd);
				setMessages(prev => [...prev, saved]);
			} catch (e) { console.error('Error enviando archivo', e); }
		} else {
			sendMessage(socket, {
				senderId: userId,
				receiverId: isGroupMessage ? undefined : currentChatId,
				groupId:   isGroupMessage ? currentChatId : undefined,
				content,
				isGroupMessage,
			});

			/* vista optimista */
			const me = users.find(u => u._id === userId);
			const temp: Message = {
				_id: `${Date.now()}`,
				sender: { _id: userId, username: me?.username || 'Yo', profile: me?.profile },
				receiver: isGroupMessage ? null : currentChatId,
				content,
				isGroupMessage,
				isRead: true,
				createdAt: new Date().toISOString(),
			};
			setMessages(prev => [...prev, temp]);
		}
	};

	/* borrar mensaje */
	const handleDelete = async (id: string) => {
		try { await delMsg(id); }
		finally { setMessages(prev => prev.filter(m => m._id !== id)); }
	};

	/* selección de chat */
	const selectUser  = (id: string) => { setCurrentChatId(id); setIsGroupMessage(false); };
	const selectGroup = (id: string) => { setCurrentChatId(id); setIsGroupMessage(true); };

	const hasAdmin = userHasAdminRole();
	const visibleLinks = navLinks.filter((l) => !l.adminOnly || hasAdmin);

	return (
		<>
			<Header
				logoSrc={Logo}
				variant='gradient'
				navLinks={visibleLinks}
				userRole={hasAdmin ? 'admi' : 'student'}
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={
					<SearchOverlay
						onSearch={(q, cat) =>
							console.log(`Buscar "${q}" en categoría "${cat}"`)
						}
					/>
				}
			/>
			<MessagingContainer>
				<InboxMsg>
					<InboxPeople
						users={users}
						groups={groups}
						currentChatId={currentChatId}
						onSelectUser={selectUser}
						onSelectGroup={selectGroup}
						isFloating={isFloating}
						showUserList={showUserList}
						toggleUserList={toggleUserList}
					/>

					{(!isFloating || !showUserList) && (
						currentChatId ? (
							<Messages
								messages={messages}
								currentUserId={userId}
								handleSendMessage={handleSend}
								handleDeleteMessage={handleDelete}
								loadMoreMessages={loadMore}
								hasMoreMessages={hasMore}
							/>
						) : <ChatSelect />
					)}
				</InboxMsg>
			</MessagingContainer>
		</>
	);
};

export default Chat;

