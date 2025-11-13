// src/ui/features/friends/pages/BlockedUsersList.tsx
import React from 'react';
import { Typography } from '@mui/material';

import { useBlockedUsers } from '../hooks/useBlockedUsers';
import {
  BlockedUsersContainer,
  Title,
  BlockedList,
  BlockedUserItem,
  UserName,
  UnblockButton,
} from '../blockedUsersListStyles.styles';

import UserAvatar from '../../../shared/molecules/UserAvatar';

import getEnvVariables from '../../../../config/configEnvs';
import { resolveProfileImg, pickProfilePicture, DEFAULT_AVATAR } from '../../../shared/utils/avatarUrl';

const BlockedUsersList: React.FC = () => {
  const { list, msg, unblock } = useBlockedUsers();
  const { HOST } = getEnvVariables();

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
  };

  return (
    <BlockedUsersContainer>
      <Title variant="h5">Usuarios Bloqueados</Title>
      {msg && <Typography color="error">{msg}</Typography>}
      <BlockedList>
        {list.map((user) => {
          const rel = pickProfilePicture(user);
          const src = resolveProfileImg(HOST, rel);

          return (
            <BlockedUserItem key={user._id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={src}
                  alt={user.username}
                  onError={onImgError}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <UserName>{user.username}</UserName>
              </div>
              <UnblockButton onClick={() => unblock(user._id)}>Desbloquear usuario</UnblockButton>
            </BlockedUserItem>
          );
        })}
      </BlockedList>
    </BlockedUsersContainer>
  );
};


export default BlockedUsersList;

