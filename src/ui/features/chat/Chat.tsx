// Chat.tsx
import React, { useState, useEffect } from 'react';
import { InboxPeople } from './InboxPeople';
import { Messages } from './Messages';
import { ChatSelect } from './ChatSelect';
import { MessagingContainer, InboxMsg } from './ChatStyles';
import { useMessages } from './hooks/useMessage';
import { useSocket } from '../../providers/SocketProvider';
import {
  sendMessage,
  sendFileMessage,
  deleteMessage as delMsg,
  fetchConversations,
} from '../../../async/services/messageService';
import type { ConversationSummary } from '../../../async/services/messageService';
import { get } from '../../../async/api';
import getEnvVariables from '../../../config/configEnvs';
import type { User, Group, Message } from '../../../types/types';
import { Box } from '@mui/material';

import Header from '../../shared/organisms/header/Header';
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import { navLinks } from '../../../config/navLinks';
import SearchOverlay from '../../shared/organisms/SearchOverlay/SearchOverlay';
import { userHasAdminRole } from '../../../utils/auth/getUserId';
import { useSearchParams } from 'react-router-dom';

interface ChatProps {
  userId: string;
  isFloating?: boolean;
}

const Chat: React.FC<ChatProps> = ({ userId, isFloating = false }) => {
  const [currentChatId, setCurrentChatId] = useState('');
  const [isGroupMessage, setIsGroupMessage] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserList, setShowUserList] = useState(true);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const { messages, setMessages, loadMore, hasMore } =
    useMessages(currentChatId, isGroupMessage);

  const socket = useSocket();
  const { HOST, SERVICE } = getEnvVariables();

  const [searchParams, setSearchParams] = useSearchParams();

  /* detectar móvil */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768 || isFloating);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [isFloating]);

  /* cargar amigos y grupos */
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { friends } = await get<{ friends: User[] }>(`${HOST}${SERVICE}/users/friends`, {});
        setUsers(friends.filter(u => u._id !== userId));

        const { groups } = await get<{ groups: Group[] }>(`${HOST}${SERVICE}/groups`, {});
        setGroups(groups);
      } catch (e) {
        console.error('Error cargando contactos', e);
      }
    };
    fetchContacts();
  }, [HOST, SERVICE, userId]);

  /* cargar conversaciones (chats recientes) */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const convos = await fetchConversations(0, 50);
        if (alive) setConversations(convos);
      } catch (e) {
        console.error('Error fetchConversations', e);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* URL ↔ estado de UI (clave para botón Atrás) */
  useEffect(() => {
    const chatId = searchParams.get('chat') || '';
    const type = searchParams.get('type'); // 'dm' | 'group' | null

    if (chatId) {
      // Hay chat seleccionado en la URL
      setCurrentChatId(chatId);
      setIsGroupMessage(type === 'group');

      if (isMobile || isFloating) {
        setShowUserList(false); // en móvil, al tener chat abrimos visor
      }
    } else {
      // No hay chat en la URL → mostrar lista
      setCurrentChatId('');
      setIsGroupMessage(false);
      setShowUserList(true);
    }
  }, [searchParams, isMobile, isFloating]);

  /* helper: subir/crear conversación al tope */
  const bumpConversation = (peerId: string, previewContent = '', createdAt?: string, isIncoming = false) => {
    if (!peerId) return;
    setConversations(prev => {
      const exist = prev.find(c => String(c.peer._id) === peerId);
      const rest = prev.filter(c => String(c.peer._id) !== peerId);

      const usernameFallback =
        exist?.peer?.username ||
        users.find(u => u._id === peerId)?.username ||
        'Usuario';

      const updated: ConversationSummary = {
        peer: exist?.peer ?? { _id: peerId as any, username: usernameFallback, profile: exist?.peer?.profile },
        lastMessageAt: createdAt ?? new Date().toISOString(),
        lastMessage: { content: previewContent || exist?.lastMessage?.content, createdAt },
        unreadCount: exist
          ? exist.unreadCount + (isIncoming ? 1 : 0)
          : (isIncoming ? 1 : 0),
      };
      return [updated, ...rest];
    });
  };

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
        if (!isGroupMessage) {
          bumpConversation(currentChatId, content || '📎 Archivo', saved.createdAt, false);
        }
      } catch (e) {
        console.error('Error enviando archivo', e);
      }
    } else {
      sendMessage(socket, {
        senderId: userId,
        receiverId: isGroupMessage ? undefined : currentChatId,
        groupId: isGroupMessage ? currentChatId : undefined,
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

      if (!isGroupMessage) {
        bumpConversation(currentChatId, content, temp.createdAt, false);
      }
    }
  };

  /* borrar mensaje */
  const handleDelete = async (id: string) => {
    try { await delMsg(id); }
    finally { setMessages(prev => prev.filter(m => m._id !== id)); }
  };

  /* selección de chat: ahora escribe en la URL (crea historial) */
  const selectUser = (id: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('chat', id);
      next.set('type', 'dm');
      return next;
    });
    // reset unread del peer abierto
    setConversations(prev =>
      prev.map(c => (String(c.peer._id) === id ? { ...c, unreadCount: 0 } : c))
    );
  };
  const selectGroup = (id: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('chat', id);
      next.set('type', 'group');
      return next;
    });
  };

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
            toggleUserList={() => {
              // Si cierro la lista estando en móvil y sin chat seleccionado, no hago nada raro
              setShowUserList(prev => !prev);
            }}
            conversations={conversations}
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

