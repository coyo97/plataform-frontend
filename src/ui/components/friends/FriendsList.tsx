// src/ui/components/friends/FriendsList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	FriendsListContainer,
	Title,
	FriendsListItems,
	FriendItem,
	FriendName,
	ActionButton,
	ProfileImage,
} from './friendsListStyles.styles';

interface Profile {
	profilePicture?: string;
}

interface User {
	_id: string;
	username: string;
	email: string;
	profile?: Profile;
}

const FriendsList: React.FC = () => {
	const [list, setList] = useState<User[]>([]);
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users/friends`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (response.data && response.data.friends) {
					setList(response.data.friends);
				} else {
					console.error('La respuesta no contiene la lista de amigos esperada.');
				}
			} catch (error) {
				console.error('Error al obtener la lista de amigos:', error);
			}
		};
		fetchFriends();
	}, [HOST, SERVICE, token]);

	const removeFriend = async (friendId: string) => {
		try {
			await axios.delete(`${HOST}${SERVICE}/users/${friendId}/remove-friend`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setList((prevList) => prevList.filter((friend) => friend._id !== friendId));
			alert('Amigo eliminado');
		} catch (error) {
			console.error('Error al eliminar al amigo:', error);
			alert('Error al eliminar al amigo');
		}
	};

	const blockUser = async (userId: string) => {
		try {
			await axios.post(`${HOST}${SERVICE}/users/${userId}/block`, {}, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setList((prevList) => prevList.filter((friend) => friend._id !== userId));
			alert('Usuario bloqueado');
		} catch (error) {
			console.error('Error al bloquear al usuario:', error);
			alert('Error al bloquear al usuario');
		}
	};

	return (
		<FriendsListContainer>
			<Title variant="h5">Lista de Amigos</Title>
			<FriendsListItems>
				{list.map((friend) => (
					<FriendItem key={friend._id}>
						{/* Mostrar la foto de perfil */}
						{friend.profile?.profilePicture ? (
							<ProfileImage
								src={`${HOST}/${friend.profile.profilePicture}`}
								alt={`${friend.username}'s profile`}
							/>
						) : (
						// Si no tiene foto de perfil, mostrar una imagen por defecto o un placeholder
						<ProfileImage
							src={`${HOST}/path/to/default/profile/image.jpg`}
							alt="Default profile"
						/>
						)}
						<FriendName variant="body1">{friend.username}</FriendName>
						<div>
							<ActionButton onClick={() => removeFriend(friend._id)}>Eliminar amigo</ActionButton>
							<ActionButton onClick={() => blockUser(friend._id)}>Bloquear usuario</ActionButton>
						</div>
					</FriendItem>
				))}
			</FriendsListItems>
		</FriendsListContainer>
	);
};
export default FriendsList;

