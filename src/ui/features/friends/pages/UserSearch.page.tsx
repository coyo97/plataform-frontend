// src/ui/features/friends/pages/UserSearch.page.tsx
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

import UserAvatar from '../../../shared/molecules/UserAvatar';
import getEnvVariables from '../../../../config/configEnvs';
import { resolveProfileImg, pickProfilePicture, DEFAULT_AVATAR } from '../../../shared/utils/avatarUrl';

const UserSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { results, msg, search, sendRequest } = useUserSearch();
  const { HOST } = getEnvVariables();

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
  };

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
          className="tf-compact"
          value={query}
          onChange={setQuery}
          placeholder="nombre de usuario o email"
        />
        <FilledButton type="submit">Buscar</FilledButton>
      </SearchForm>

      <ResultsList>
        {results.map((user) => {
          const rel = pickProfilePicture(user);
          const src = resolveProfileImg(HOST, rel);

          return (
            <ResultItem key={user._id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={src}
                  alt={user.username}
                  onError={onImgError}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <Text>{user.username} ({user.email})</Text>
              </div>

              {user.status === 'none' && (
                <FilledButton onClick={() => sendRequest(user._id)}>Enviar Solicitud</FilledButton>
              )}
              {user.status === 'friend' && <StatusText>Ya son amigos</StatusText>}
              {user.status === 'request_sent' && <StatusText>Solicitud enviada</StatusText>}
              {user.status === 'request_received' && <StatusText>Te ha enviado una solicitud</StatusText>}
            </ResultItem>
          );
        })}
      </ResultsList>
    </UserSearchContainer>
  );
};

export default UserSearchPage;

