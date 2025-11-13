import React from 'react';
import { Typography } from '@mui/material';

import Text from '../../../shared/atoms/typography/Text';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';

import { useFriendsList } from '../hooks/useFriendsList';
import {
	FriendsListContainer,
	FriendsListItems,
	FriendItem,
	FriendName,
	ProfileImage,
} from '../friendsListStyles.styles';

import getEnvVariables from '../../../../config/configEnvs';
import { resolveProfileImg, pickProfilePicture, DEFAULT_AVATAR } from '../../../shared/utils/avatarUrl';

const FriendsListPage: React.FC = () => {
	const { list, msg, remove, block } = useFriendsList();
	const { HOST } = getEnvVariables();

	const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		(e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
	};

	return (
		<FriendsListContainer>
			<Typography variant="h5">Lista de Amigos</Typography>
			{msg && <Text colorKey="error.500">{msg}</Text>}

			<FriendsListItems>
				{list.map((friend) => {
					const rel = pickProfilePicture(friend);
					const src = resolveProfileImg(HOST, rel);

					return (
						<FriendItem key={friend._id}>
							<ProfileImage
								src={src}
								alt={`${friend.username}'s avatar`}
								onError={onImgError as any}
							/>
							<FriendName>{friend.username}</FriendName>
							<div style={{ display: 'flex', gap: 8 }}>
								<FilledButton onClick={() => remove(friend._id)} colorType="error" btnVariant="outline">
									Eliminar
								</FilledButton>
								<FilledButton onClick={() => block(friend._id)} colorType="warning">
									Bloquear
								</FilledButton>
							</div>
						</FriendItem>
					);
				})}
			</FriendsListItems>
		</FriendsListContainer>
	);
};

export default FriendsListPage;

