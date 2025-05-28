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

const BlockedUsersList: React.FC = () => {
	const { list, msg, unblock } = useBlockedUsers();

	return (
		<BlockedUsersContainer>
			<Title variant="h5">Usuarios Bloqueados</Title>
			{msg && <Typography color="error">{msg}</Typography>}
			<BlockedList>
				{list.map((user) => (
					<BlockedUserItem key={user._id}>
						<UserName>{user.username}</UserName>
						<UnblockButton onClick={() => unblock(user._id)}>
							Desbloquear usuario
						</UnblockButton>
					</BlockedUserItem>
				))}
			</BlockedList>
		</BlockedUsersContainer>
	);
};

export default BlockedUsersList;

