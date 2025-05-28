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

const FriendsListPage: React.FC = () => {
	const { list, msg, remove, block } = useFriendsList();

	return (
		<FriendsListContainer>
			<Typography variant="h5">Lista de Amigos</Typography>
			{msg && <Text colorKey="error.500">{msg}</Text>}

			<FriendsListItems>
				{list.map((friend) => (
					<FriendItem key={friend._id}>
						<ProfileImage
							src={
								friend.profile?.profilePicture
									? `/uploads/${friend.profile.profilePicture}`
									: '/assets/default-avatar.png'
							}
							alt={`${friend.username}'s avatar`}
						/>
						<FriendName>{friend.username}</FriendName>
						<div>
							<FilledButton onClick={() => remove(friend._id)} colorType="error" btnVariant="outline">
								Eliminar
							</FilledButton>
							<FilledButton onClick={() => block(friend._id)} colorType="warning">
								Bloquear
							</FilledButton>
						</div>
					</FriendItem>
				))}
			</FriendsListItems>
		</FriendsListContainer>
	);
};

export default FriendsListPage;

