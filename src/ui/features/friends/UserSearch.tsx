// src/ui/components/profile/UserSearch.tsx
import React, { useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	UserSearchContainer,
	SearchForm,
	SearchInput,
	SearchButton,
	ResultsList,
	ResultItem,
	UserName,
	StatusText,
} from './userSearchStyles.styles';
import { Typography } from '@mui/material';

interface User {
	_id: string;
	username: string;
	email: string;
	status: 'none' | 'friend' | 'request_sent' | 'request_received';
}

const UserSearch: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [results, setResults] = useState<User[]>([]);
	const [message, setMessage] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.get(`${HOST}${SERVICE}/users/search`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				params: { q: searchQuery },
			});
			if (response.data && response.data.users) {
				setResults(response.data.users);
			} else {
				console.error('La respuesta no contiene los usuarios esperados.');
			}
		} catch (error) {
			console.error('Error al buscar usuarios:', error);
		}
	};

	const handleSendFriendRequest = async (id: string) => {
		try {
			await axios.post(
				`${HOST}${SERVICE}/users/${id}/send-friend-request`,
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);
			setMessage('Solicitud de amistad enviada');
			setResults(results.map(user => user._id === id ? { ...user, status: 'request_sent' } : user));
		} catch (error) {
			console.error('Error al enviar la solicitud de amistad:', error);
			setMessage('Error al enviar la solicitud de amistad');
		}
	};

	return (
		<UserSearchContainer>
			<Typography variant="h5" component="h1">Buscar Usuarios</Typography>
			{message && <Typography color="primary">{message}</Typography>}
			<SearchForm onSubmit={handleSearch}>
				<SearchInput
					placeholder="Buscar por nombre de usuario o email"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					required
				/>
				<SearchButton type="submit">Buscar</SearchButton>
			</SearchForm>
			<ResultsList>
				{results.map((user) => (
					<ResultItem key={user._id}>
						<UserName variant="body1">{user.username} ({user.email})</UserName>
						{user.status === 'none' && (
							<SearchButton onClick={() => handleSendFriendRequest(user._id)}>Enviar Solicitud</SearchButton>
						)}
						{user.status === 'friend' && <StatusText>Ya son amigos</StatusText>}
						{user.status === 'request_sent' && <StatusText>Solicitud enviada</StatusText>}
						{user.status === 'request_received' && <StatusText>Te ha enviado una solicitud</StatusText>}
					</ResultItem>
				))}
			</ResultsList>
		</UserSearchContainer>
	);
};

export default UserSearch;

