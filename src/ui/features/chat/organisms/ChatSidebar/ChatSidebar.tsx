// ChatSidebar.tsx
import React from 'react';
import Text from '../../../../shared/atoms/typography/Text';
import ConversationItem from '../../atoms/ConversationItem/ConversationItem';
import GroupManager from '../../../groups/GroupManager';
import GroupUser from '../../../groups/GroupUser';

import { Wrapper, SectionTitle } from './chatSidebar.styles';
import type { ChatSidebarProps } from './chatSidebar.types';

import getEnvVariables from '../../../../../config/configEnvs';

const ChatSidebar:React.FC<ChatSidebarProps> = ({
	users, groups, activeId,
	onSelectUser, onSelectGroup
}) => {
	const { HOST } = getEnvVariables();

	return (
		<Wrapper>
			{/* === usuarios ================================================== */}
			<SectionTitle>Usuarios</SectionTitle>
			{users.map(u => (
				<ConversationItem
					key={u._id}
					id={u._id}
					name={u.username}
					avatarUrl={u.profile?.profilePicture ? `${HOST}/${u.profile.profilePicture}` : undefined}
					active={u._id === activeId}
					onSelect={()=>onSelectUser(u._id)}
				/>
			))}

			{/* === grupos ==================================================== */}
			<SectionTitle>Grupos</SectionTitle>
			{groups.map(g => (
				<ConversationItem
					key={g._id}
					id={g._id}
					name={g.name}
					active={g._id === activeId}
					onSelect={()=>onSelectGroup(g._id)}
				/>
			))}

			{/* === utilidades para grupos ==================================== */}
			<GroupUser />
			<GroupManager />
		</Wrapper>
	);
};

export default ChatSidebar;

