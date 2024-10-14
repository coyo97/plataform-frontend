import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

import { InboxPeople } from './InboxPeople';
import { Messages } from './Messages';
import { ChatSelect } from './ChatSelect';

// Importamos los estilos desde el archivo de estilos centralizado
import { MessagingContainer, InboxMsg } from './ChatStyles';


interface Message {
	_id: string;
	senderId: string;
	receiverId: string | null;
	content: string;
	isGroupMessage: boolean;
	groupId?: string;
	sender?: {
		username: string;
		rofile?: {
			profilePicture?: string;
		};

	};
	isRead: boolean;
	createdAt: string;
}

interface Group {
	_id: string;
	name: string;
}

interface User {
	_id: string;
	username: string;
	profile?: {
		profilePicture?: string;
	};
}

interface ChatProps {
	userId: string;
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentChatId, setCurrentChatId] = useState('');
	const [groups, setGroups] = useState<Group[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [isGroupMessage, setIsGroupMessage] = useState(false);

	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token en el localStorage');
			return;
		}

		// Conectar al servidor de Socket.IO
		const newSocket = io(`${HOST}`, {
			auth: {
				token: token,
			},
		});

		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log('Conectado al servidor de Socket.IO');
		});

		newSocket.on('receive-message', (data: Message) => {
			console.log('Mensaje recibido:', data);
			const isValidDate = !isNaN(new Date(data.createdAt).getTime());
			if (!isValidDate) {
				console.warn(`Fecha inválida recibida en el mensaje: ${data.createdAt}`);
			}
			if (
				(data.senderId === currentChatId || data.receiverId === currentChatId) ||
				(data.isGroupMessage && data.groupId === currentChatId)
			) {
				setMessages((prevMessages) => [...prevMessages, data]);
			}
		});

		return () => {
			newSocket.close();
		};
	}, [HOST, userId, currentChatId]);

	// Cargar usuarios y grupos
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token en el localStorage');
			return;
		}

		// Cargar usuarios
		axios
		.get(`${HOST}${SERVICE}/users`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((response) => {
			const filteredUsers = response.data.list.filter((user: User) => user._id !== userId);
			setUsers(filteredUsers);
			console.log('Usuarios cargados:', filteredUsers);
		})
		.catch((error) => {
			console.error('Error fetching users:', error);
		});

		// Cargar grupos
		axios
		.get(`${HOST}${SERVICE}/groups`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((response) => {
			setGroups(response.data.groups);
			console.log('Grupos cargados:', response.data.groups);
		})
		.catch((error) => {
			console.error('Error fetching groups:', error);
		});
	}, [HOST, SERVICE, userId]);

	useEffect(() => {
		if (currentChatId) {
			const token = localStorage.getItem('token');
			const endpoint = isGroupMessage ? `/messages/group/${currentChatId}` : `/messages/user/${currentChatId}`;
			axios
			.get(`${HOST}${SERVICE}${endpoint}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				//console.log('Mensajes cargados:', response.data.messages);
				//console.log('Respuesta del servidor al cargar mensajes:', response.data);
				setMessages(response.data.messages || []);
				//console.log('Mensajes cargados:', response.data.messages);
			})
			.catch((error) => {
				console.error('Error fetching messages:', error);
			});
		}
	}, [currentChatId, isGroupMessage, HOST, SERVICE]);

	// Chat.tsx

	const handleSendMessage = async (messageContent: string, selectedFile?: File | null) => {
		if ((!messageContent.trim() && !selectedFile) || !currentChatId) return;

		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token en el localStorage');
			return;
		}

		if (selectedFile) {
			const formData = new FormData();
			formData.append('content', messageContent);
			formData.append('receiverId', isGroupMessage ? '' : currentChatId);
			formData.append('isGroupMessage', isGroupMessage.toString());
			if (isGroupMessage) {
				formData.append('groupId', currentChatId);
			}
			formData.append('file', selectedFile);

			try {
				const response = await axios.post(`${HOST}${SERVICE}/messages/send-with-file`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				});

				// Actualizar mensajes inmediatamente en la interfaz de usuario
				const savedMessage: Message = response.data.message;
				setMessages((prevMessages) => [...prevMessages, savedMessage]);

			} catch (error) {
				console.error('Error al enviar mensaje con archivo:', error);
			}
		} else {
			const newMessage = {
				senderId: userId,
				receiverId: isGroupMessage ? null : currentChatId,
				content: messageContent,
				isGroupMessage,
				groupId: isGroupMessage ? currentChatId : undefined,
			};

			socket?.emit('send-message', newMessage);

			const currentUser = users.find((user) => user._id === userId);
			// Actualizar mensajes inmediatamente en la interfaz de usuario
			setMessages((prevMessages) => [
				...prevMessages,
				{
					_id: `${Date.now()}`, // ID temporal
					senderId: userId,
					receiverId: currentChatId,
					content: messageContent,
					isGroupMessage,
					isRead: true,
					createdAt: new Date().toISOString(),
					sender: {
						username: currentUser?.username || 'Yo',
						profilePicture: currentUser?.profile?.profilePicture,
					},
				},
			]);
		}
	};

	const handleSelectUser = (userId: string) => {
		setCurrentChatId(userId);
		setIsGroupMessage(false);
	};

	const handleSelectGroup = (groupId: string) => {
		setCurrentChatId(groupId);
		setIsGroupMessage(true);
	};

	return (
		<MessagingContainer>
			<InboxMsg>
				<InboxPeople
					users={users}
					groups={groups}
					currentChatId={currentChatId}
					onSelectUser={handleSelectUser}
					onSelectGroup={handleSelectGroup}
				/>
				{currentChatId ? (
					<Messages
						messages={messages}
						currentUserId={userId}
						handleSendMessage={handleSendMessage}
					/>
				) : (
					<ChatSelect />
				)}
			</InboxMsg>
		</MessagingContainer>
	);
};

export default Chat;

