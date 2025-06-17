import React, { useState } from 'react';
import { SidebarChatItem } from './SidebarChatItem';
import { SidebarContainer, SectionTitle } from './sidebar.styles';
import GroupManager from '../groups/GroupManager';
import GroupUser    from '../groups/GroupUser';
import { Searchbox } from './Searchbox';
import Dialog from '@mui/material/Dialog';
import Slide  from '@mui/material/Slide';
import CreateGroupDialog from '../groups/CreateGroupDialog';
import GroupAddIcon      from '@mui/icons-material/GroupAdd';

import { ChatView } from './chat.types';

interface User {
	_id: string;
	username: string;
	profilePicture?: string; // Añade este campo
}

interface Group {
	_id: string;
	name: string;
}

interface SidebarProps {
	users        : User[];
	groups       : Group[];
	currentChatId: string;
	onSelectUser : (userId: string)  => void;
	onSelectGroup: (groupId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
	const [view, setView] = useState<ChatView>('users'); // ← nuevo estado local
	const [openDialog, setOpenDialog] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<>
			<SidebarContainer>

				{/* ① barra de switches */}
				<Searchbox view={view} onChange={setView} onDialogOpen={() => setOpenDialog(true)} onCreateOpen={() => setOpenCreate(true)}/>

				{/* ② render condicional */}
				{view === 'users' && (
					<>
						<SectionTitle>Usuarios</SectionTitle>
						{props.users.map(u => (
							<SidebarChatItem
								key={u._id}
								item     ={u}
								isActive ={u._id === props.currentChatId}
								onClick  ={() => props.onSelectUser(u._id)}
							/>
						))}
					</>
				)}

				{view === 'groups' && (
					<>
						<SectionTitle>Grupos</SectionTitle>
						{props.groups.map(g => (
							<SidebarChatItem
								key={g._id}
								item     ={{ _id: g._id, username: g.name }}
								isActive ={g._id === props.currentChatId}
								onClick  ={() => props.onSelectGroup(g._id)}
							/>
						))}
					</>
				)}

				{/* mantiene utilidades de administración */}
				<GroupManager />
			</SidebarContainer>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				fullWidth
				maxWidth="md"
				TransitionComponent={Slide}
			>
				<div style={{ padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
					<GroupUser />
				</div>
			</Dialog>
			<CreateGroupDialog open={openCreate} onClose={() => setOpenCreate(false)} />
		</>
	);
};
