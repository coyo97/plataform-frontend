// Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
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
	markMessageAsRead,
} from '../../../async/services/messageService';
import type { ConversationSummary } from '../../../async/services/messageService';
import { get } from '../../../async/api';
import getEnvVariables from '../../../config/configEnvs';
import type { User, Group, Message } from '../../../types/types';
import { UiMessage } from './uiMessage';

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
	const [onlineSet, setOnlineSet] = useState<Set<string>>(new Set());

	// 👇 IDs de mensajes ya procesados para evitar duplicar unreadCount
	const processedMsgIdsRef = useRef<Set<string>>(new Set());

	/* presencia (online/offline) */
	useEffect(() => {
		if (!socket) return;
		socket.emit('presence:list', (ids: string[]) => {
			setOnlineSet(new Set(ids));
		});

		const onPresence = (p: { userId: string; online: boolean }) => {
			setOnlineSet((prev) => {
				const clone = new Set(prev);
				if (p.online) clone.add(p.userId);
				else clone.delete(p.userId);
				return clone;
			});
		};

		socket.on('presence:update', onPresence);
		return () => {
			socket.off('presence:update', onPresence);
		};
	}, [socket]);

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
				const { friends } = await get<{ friends: User[] }>(
					`${HOST}${SERVICE}/users/friends`,
					{},
				);
				setUsers(friends.filter((u) => u._id !== userId));

				const { groups } = await get<{ groups: Group[] }>(
					`${HOST}${SERVICE}/groups`,
					{},
				);
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
		return () => {
			alive = false;
		};
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
	const bumpConversation = (
		peerId: string,
		previewContent = '',
		createdAt?: string,
		isIncoming = false,
	) => {
		if (!peerId) return;
		setConversations((prev) => {
			const exist = prev.find((c) => String(c.peer._id) === peerId);
			const rest = prev.filter((c) => String(c.peer._id) !== peerId);

			const usernameFallback =
				exist?.peer?.username ||
				users.find((u) => u._id === peerId)?.username ||
				'Usuario';

			const updated: ConversationSummary = {
				peer:
					exist?.peer ??
					({
						_id: peerId as any,
						username: usernameFallback,
						profile: exist?.peer?.profile,
					} as any),
				lastMessageAt: createdAt ?? new Date().toISOString(),
				lastMessage: {
					content: previewContent || exist?.lastMessage?.content,
					createdAt,
					// mantenemos el resto tal cual
					...(exist?.lastMessage || {}),
				},
				unreadCount: exist
					? exist.unreadCount + (isIncoming ? 1 : 0)
					: isIncoming
					? 1
					: 0,
			};
			return [updated, ...rest];
		});
	};

	/* 🔔 actualizar conversaciones / unread en tiempo real (solo DMs, sin duplicados) */
	useEffect(() => {
		if (!socket) return;

		const handler = (msg: Message & { _id: string }) => {
			// ignorar mensajes de grupo en la lista de conversaciones (de momento)
			if (msg.isGroupMessage) return;

			// evitar procesar el mismo mensaje 2 veces
			if (processedMsgIdsRef.current.has(msg._id)) {
				console.log('[CHAT][receive-message] duplicado ignorado', msg._id);
				return;
			}
			processedMsgIdsRef.current.add(msg._id);

			const rawSender = msg.sender as any;
			const senderId: string =
				typeof rawSender === 'string'
					? rawSender
					: rawSender?._id?.toString?.() || '';

			const rawReceiver = (msg as any).receiver;
			const receiverId: string =
				typeof rawReceiver === 'string'
					? rawReceiver
					: rawReceiver?._id?.toString?.() || '';

			if (!senderId || !receiverId) return;

			// si es mi propio mensaje, no tocamos unread (ya lo manejamos en handleSend)
			if (senderId === userId) return;

			// en un DM entrante, el "peer" es siempre el emisor
			const peerId = senderId;
			if (!peerId) return;

			const isCurrentDM = !isGroupMessage && currentChatId === peerId;

			const preview =
				(msg as any).filePath && !msg.content
					? '📎 Archivo'
					: msg.content || '📎 Archivo';

			// isIncoming = true solo si el chat NO está abierto
			bumpConversation(peerId, preview, msg.createdAt, !isCurrentDM);
		};

		socket.on('receive-message', handler);

		return () => {
			socket.off('receive-message', handler);
		};
	}, [socket, userId, currentChatId, isGroupMessage]);

	/* marcar como leídos los mensajes visibles en el chat actual (solo DMs) */
	useEffect(() => {
		if (!currentChatId) return;
		if (isGroupMessage) return;

		const unread = messages.filter((m) => {
			if (m.isRead) return false;

			const rawReceiver = (m as any).receiver;
			const receiverId: string =
				typeof rawReceiver === 'string'
					? rawReceiver
					: rawReceiver?._id?.toString?.() || '';

			return receiverId === userId;
		});

		if (!unread.length) return;

		const unreadIds = new Set(unread.map((m) => m._id));

		// actualizar estado local de mensajes
		setMessages((prev) =>
			prev.map((m) =>
				unreadIds.has(m._id) ? { ...m, isRead: true } : m,
			),
		);

		// poner contador de esa conversación en 0
		setConversations((prev) =>
			prev.map((c) =>
				String(c.peer._id) === currentChatId
					? { ...c, unreadCount: 0 }
					: c,
			),
		);

		// avisar al backend
		unread.forEach((m) => {
			markMessageAsRead(m._id).catch((err) => {
				console.error('Error markMessageAsRead', err);
			});
		});
	}, [
		currentChatId,
		isGroupMessage,
		messages,
		userId,
		setMessages,
		setConversations,
	]);

	/* enviar mensaje (texto o archivo) */
	const handleSend = async (content: string, file?: File | null) => {
		if ((!content?.trim() && !file) || !currentChatId) return;

		// --------- ARCHIVO (HTTP) ----------
		if (file) {
			console.log('[CHAT][handleSend:file] START', {
				isGroupMessage,
				currentChatId,
				content,
				fileName: file.name,
			});

			const fd = new FormData();
			fd.append('content', content);
			fd.append('receiverId', isGroupMessage ? '' : currentChatId);
			fd.append('isGroupMessage', String(isGroupMessage));
			if (isGroupMessage) fd.append('groupId', currentChatId);
			fd.append('file', file);

			try {
				const saved = await sendFileMessage(fd);
				console.log('[CHAT][handleSend:file] HTTP response', {
					savedId: saved._id,
					isGroupMessage: saved.isGroupMessage,
					groupId: (saved as any).groupId,
					receiver: (saved as any).receiver,
					senderId: (saved as any).sender?._id,
				});

				if (!isGroupMessage) {
					console.log('[CHAT][handleSend:file] pushing to messages (DM)');
					setMessages((prev) => {
						console.log(
							'[CHAT][handleSend:file] prev length (DM) =',
							prev.length,
						);
						const next = [...prev, { ...saved, status: 'sent' } as any];
						console.log(
							'[CHAT][handleSend:file] next length (DM) =',
							next.length,
						);
						return next;
					});
					bumpConversation(
						currentChatId,
						content || '📎 Archivo',
						saved.createdAt,
						false,
					);
				} else {
					console.log(
						'[CHAT][handleSend:file] group message → NO push, esperar socket',
					);
				}
			} catch (e) {
				console.error('Error enviando archivo', e);
			}
			return;
		}

		// --------- TEXTO ----------
		if (!isGroupMessage) {
			// DM con optimista + ACK
			const clientId = `c_${Date.now()}_${Math.random()
				.toString(36)
				.slice(2, 8)}`;
			const me = users.find((u) => u._id === userId);

			// Mensaje temporal optimista
			const temp: any = {
				_id: clientId, // clave temporal para reconciliar
				clientId,
				status: 'sending', // sending | sent | failed
				sender: {
					_id: userId,
					username: me?.username || 'Yo',
					profile: me?.profile,
				},
				receiver: currentChatId,
				content,
				isGroupMessage: false,
				isRead: true,
				createdAt: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, temp]);

			// Emitimos con ACK
			socket?.emit(
				'send-message',
				{
					senderId: userId,
					receiverId: currentChatId,
					content,
					isGroupMessage: false,
					clientId,
				},
				(ack?: { ok: boolean; message?: any; clientId?: string }) => {
					if (ack && ack.ok && ack.message) {
						setMessages((prev) =>
							prev.map((m) =>
								(m as any).clientId === clientId
									? { ...(ack.message as any), clientId, status: 'sent' }
									: m,
							),
						);
						bumpConversation(
							currentChatId,
							content,
							ack.message.createdAt,
							false,
						);
					} else {
						setMessages((prev) =>
							prev.map((m) =>
								(m as any).clientId === clientId
									? { ...m, status: 'failed' }
									: m,
							),
						);
					}
				},
			);

			// Failsafe: si en 10s no llegó ACK, marcar como 'failed'
			setTimeout(() => {
				setMessages((prev) =>
					prev.map((m) =>
						(m as any).clientId === clientId &&
						(m as any).status === 'sending'
							? { ...m, status: 'failed' }
							: m,
					),
				);
			}, 10000);
		} else {
			// GRUPO: sin optimista (evitar doble), solo emitimos
			socket?.emit('send-message', {
				senderId: userId,
				groupId: currentChatId,
				content,
				isGroupMessage: true,
			});
		}
	};

	/* borrar mensaje */
	const handleDelete = async (id: string) => {
		try {
			await delMsg(id);
		} finally {
			setMessages((prev) => prev.filter((m) => m._id !== id));
		}
	};

	/* selección de chat: ahora escribe en la URL (crea historial) */
	const selectUser = (id: string) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set('chat', id);
			next.set('type', 'dm');
			return next;
		});
		setConversations((prev) =>
			prev.map((c) =>
				String(c.peer._id) === id ? { ...c, unreadCount: 0 } : c,
			),
		);
	};
	const selectGroup = (id: string) => {
		setSearchParams((prev) => {
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
				variant="gradient"
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
							setShowUserList((prev) => !prev);
						}}
						conversations={conversations}
						onlineSet={onlineSet}
					/>

					{(!isFloating || !showUserList) &&
						(currentChatId ? (
							<Messages
								messages={messages}
								currentUserId={userId}
								handleSendMessage={handleSend}
								handleDeleteMessage={handleDelete}
								loadMoreMessages={loadMore}
								hasMoreMessages={hasMore}
							/>
						) : (
							<ChatSelect />
						))}
				</InboxMsg>
			</MessagingContainer>
		</>
	);
};

export default Chat;

