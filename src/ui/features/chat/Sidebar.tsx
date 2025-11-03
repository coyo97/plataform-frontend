// ui/features/chat/Sidebar.tsx
import React, { useState, useMemo } from 'react';
import { SidebarChatItem } from './SidebarChatItem';
import { SidebarContainer, SectionTitle } from './sidebar.styles';
import GroupManager from '../groups/GroupManager';
import GroupUser from '../groups/GroupUser';
import { Searchbox } from './Searchbox';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import CreateGroupDialog from '../groups/CreateGroupDialog';
import { ChatView } from './chat.types';

interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
	profilePicture?: string;
}

interface Group {
	_id: string;
	name: string;
}

export type ConversationItem = {
	peer: {
		_id: string;
		username: string;
		profile?: { profilePicture?: string };
		profilePicture?: string;
	};
	lastMessageAt: string | null;
	lastMessage?: { content?: string } | null;
	unreadCount: number;
	pinned?: boolean;
	muted?: boolean;
};

interface SidebarProps {
	users: User[];
	groups: Group[];
	conversations?: ConversationItem[];
	currentChatId: string;
	onSelectUser: (userId: string) => void;
	onSelectGroup: (groupId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
	// Vista inicial: chats (puedes cambiar a 'users' si prefieres)
	const [view, setView] = useState<ChatView>('chats');
	const [openDialog, setOpenDialog] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);

	// Solo chats con mensajes + orden por último mensaje (desc)
	const activeChats = useMemo(() => {
		const list = (props.conversations ?? []).filter((c) => !!c.lastMessageAt);
		return list.sort((a, b) => {
			const ta = a.lastMessageAt ? Date.parse(a.lastMessageAt) : 0;
			const tb = b.lastMessageAt ? Date.parse(b.lastMessageAt) : 0;
			return tb - ta;
		});
	}, [props.conversations]);

	// Usuarios ordenados alfabéticamente
	const usersSorted = useMemo(
		() => [...props.users].sort((a, b) => a.username.localeCompare(b.username)),
		[props.users]
	);

	// Contadores para los tabs del Searchbox
	const counters = {
		chats: activeChats.length,
		users: usersSorted.length,
		groups: props.groups.length,
	};

	return (
		<>
			<SidebarContainer>
				{/* Tabs (Chats / Usuarios / Grupos) + acciones de grupos */}
				<Searchbox
					view={view}
					onChange={setView}
					onDialogOpen={() => setOpenDialog(true)}
					onCreateOpen={() => setOpenCreate(true)}
					counters={counters}
				/>

				{/* TAB: Chats */}
				{view === 'chats' && (
					<>
						<SectionTitle>Chats{counters.chats ? ` (${counters.chats})` : ''}</SectionTitle>

						{activeChats.length === 0 && (
							<div style={{ padding: '8px 12px', opacity: 0.7, fontSize: 13 }}>
								Aún no tienes conversaciones. Inicia una desde “Usuarios”.
							</div>
						)}

						{activeChats.map((c) => {
							const { _id, username } = c.peer;
							const isActive = _id === props.currentChatId;

							// Foto: primero de la conversación; si no, desde users[]
							let profilePicture =
								c.peer.profile?.profilePicture ??
								c.peer.profilePicture ??
								props.users.find((u) => u._id === _id)?.profile?.profilePicture ??
								props.users.find((u) => u._id === _id)?.profilePicture ??
								undefined;

							return (
								<SidebarChatItem
									key={_id}
									item={{ _id, username, profile: { profilePicture } }}
									isActive={isActive}
									onClick={() => props.onSelectUser(_id)}
								/>
							);
						})}
					</>
				)}

				{/* TAB: Usuarios */}
				{view === 'users' && (
					<>
						<SectionTitle>Usuarios{counters.users ? ` (${counters.users})` : ''}</SectionTitle>

						{usersSorted.map((u) => {
							const profilePicture = u.profile?.profilePicture ?? u.profilePicture ?? undefined;

							return (
								<SidebarChatItem
									key={u._id}
									item={{ _id: u._id, username: u.username, profile: { profilePicture } }}
									isActive={u._id === props.currentChatId}
									onClick={() => props.onSelectUser(u._id)}
								/>
							);
						})}
					</>
				)}

				{/* TAB: Grupos */}
				{view === 'groups' && (
					<>
						<SectionTitle>Grupos{counters.groups ? ` (${counters.groups})` : ''}</SectionTitle>
						{props.groups.map((g) => (
							<SidebarChatItem
								key={g._id}
								item={{ _id: g._id, username: g.name }}
								isActive={g._id === props.currentChatId}
								onClick={() => props.onSelectGroup(g._id)}
							/>
						))}
					</>
				)}

				{/* Utilidades de administración de grupos */}
				<GroupManager />
			</SidebarContainer>

			{/* Dialog listado de usuarios para agregar a grupos */}
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

			{/* Dialog crear grupo */}
			<CreateGroupDialog open={openCreate} onClose={() => setOpenCreate(false)} />
		</>
	);
};

