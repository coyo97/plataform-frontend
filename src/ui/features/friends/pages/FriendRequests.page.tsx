// src/ui/features/friends/pages/FriendRequests.page.tsx
import React from 'react';
import { useFriendRequests } from '../hooks/useFriendRequests';

import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import Alert from '../../../shared/atoms/feedback/alert/Alert';
import UserAvatar from '../../../shared/molecules/UserAvatar';
import getEnvVariables from '../../../../config/configEnvs';
import { resolveProfileImg, pickProfilePicture, DEFAULT_AVATAR } from '../../../shared/utils/avatarUrl';

const FriendRequestsPage: React.FC = () => {
  const { list, message, accept, reject } = useFriendRequests();
  const { HOST } = getEnvVariables();

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
  };

  return (
    <SmartBox column gap="px8" p="px12" radius="md2x" shadow="md">
      <Text as="h2" size="lg" weight="bold">Solicitudes de amistad</Text>
      {message && <Alert type="info">{message}</Alert>}

      {list.map(req => {
        const rel = pickProfilePicture(req);
        const src = resolveProfileImg(HOST, rel);

        return (
          <SmartBox key={req._id} between center p="px6" radius="sm2x" shadow="xs">
            <SmartBox row center sx={{ gap: 1 }}>
              <img
                src={src}
                alt={req.username}
                onError={onImgError}
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
              />
              <Text weight="medium">{req.username}</Text>
            </SmartBox>
            <SmartBox row gap="px4">
              <FilledButton colorType="success" btnVariant="soft" onClick={() => accept(req._id)}>Aceptar</FilledButton>
              <FilledButton colorType="error" btnVariant="soft" onClick={() => reject(req._id)}>Rechazar</FilledButton>
            </SmartBox>
          </SmartBox>
        );
      })}
    </SmartBox>
  );
};


export default FriendRequestsPage;

