import React from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Chats
import GroupsIcon            from '@mui/icons-material/Groups';
import ManageAccountsIcon    from '@mui/icons-material/ManageAccounts';
import GroupAddIcon          from '@mui/icons-material/GroupAdd';
import PersonOutlineIcon     from '@mui/icons-material/PersonOutline';   // Users

import { SearchboxContainer, SearchBar, IconToggle } from './searchBox.styles';
import { ChatView } from './chat.types';

interface Counters {
	chats?: number;
	users?: number;
	groups?: number;
}

interface SearchboxProps {
	view?: ChatView;                     
	onChange?: (v: ChatView) => void;
	onDialogOpen?: () => void;          
	onCreateOpen?: () => void;        
	counters?: Counters;               
}

export const Searchbox: React.FC<SearchboxProps> = ({
	view = 'users',
	onChange,
	onDialogOpen,
	onCreateOpen,
	counters,
}) => (
	<SearchboxContainer>
		<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
			{/* Chats */}
			<IconToggle
				active={view === 'chats'}
				aria-label="Chats"
				onClick={() => onChange?.('chats')}
				title={typeof counters?.chats === 'number' ? `${counters?.chats} chats` : 'Chats'}
			>
				<ChatBubbleOutlineIcon fontSize="small" />
				{typeof counters?.chats === 'number' && counters.chats > 0 && (
					<sup style={{ marginLeft: 4, fontSize: 11 }}>{counters.chats}</sup>
				)}
			</IconToggle>

			{/* Usuarios */}
			<IconToggle
				active={view === 'users'}
				aria-label="Usuarios"
				onClick={() => onChange?.('users')}
				title={typeof counters?.users === 'number' ? `${counters?.users} amigos` : 'Usuarios'}
			>
				<PersonOutlineIcon fontSize="small" />
				{typeof counters?.users === 'number' && counters.users > 0 && (
					<sup style={{ marginLeft: 4, fontSize: 11 }}>{counters.users}</sup>
				)}
			</IconToggle>

			{/* Grupos */}
			<IconToggle
				active={view === 'groups'}
				aria-label="Grupos"
				onClick={() => onChange?.('groups')}
				title={typeof counters?.groups === 'number' ? `${counters?.groups} grupos` : 'Grupos'}
			>
				<GroupsIcon fontSize="small" />
				{typeof counters?.groups === 'number' && counters.groups > 0 && (
					<sup style={{ marginLeft: 4, fontSize: 11 }}>{counters.groups}</sup>
				)}
			</IconToggle>

			{/* Gestionar miembros de grupos */}
			<IconToggle
				aria-label="Administrar miembros"
				active={false}
				onClick={() => onDialogOpen?.()}
				title="Administrar miembros"
			>
				<ManageAccountsIcon fontSize="small" />
			</IconToggle>

			{/* Crear grupo */}
			<IconToggle
				aria-label="Crear grupo"
				active={false}
				onClick={() => onCreateOpen?.()}
				title="Crear grupo"
			>
				<GroupAddIcon fontSize="small" />
			</IconToggle>
		</div>

		{/* barra de búsqueda (deja tu input/botón aquí si lo usas) */}
		<SearchBar>
			{/* … input / acciones … */}
		</SearchBar>
	</SearchboxContainer>
);

