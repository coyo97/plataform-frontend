import React, { useState } from 'react';
import { Typography } from '@mui/material';

import TextField from '../../../shared/atoms/textFields/TextField';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import Text from '../../../shared/atoms/typography/Text';

import { useUserSearch } from '../hooks/useUserSearch';
import {
	UserSearchContainer,
	SearchForm,
	ResultsList,
	ResultItem,
	StatusText,
} from '../userSearchStyles.styles';

const UserSearchPage: React.FC = () => {
	const [query, setQuery] = useState('');
	const { results, msg, search, sendRequest } = useUserSearch();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		search(query);
	};

	return (
		<UserSearchContainer>
			<Typography variant="h5">Buscar Usuarios</Typography>
			{msg && <Text colorKey="primary.500">{msg}</Text>}

			<SearchForm onSubmit={handleSubmit}>
				<TextField
					label="Buscar"
					value={query}
					onChange={setQuery}
					placeholder="nombre de usuario o email"
				/>
				<FilledButton type="submit">Buscar</FilledButton>
			</SearchForm>

			<ResultsList>
				{results.map((user) => (
					<ResultItem key={user._id}>
						<Text>{user.username} ({user.email})</Text>
						{user.status === 'none' && (
							<FilledButton onClick={() => sendRequest(user._id)}>
								Enviar Solicitud
							</FilledButton>
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

export default UserSearchPage;

