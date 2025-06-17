import React from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GroupsIcon            from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { SearchboxContainer, SearchBar, IconToggle } from './searchBox.styles';
import { ChatView } from './chat.types';

interface SearchboxProps {
	view?     : ChatView;             
	onChange? : (v: ChatView) => void;
	onDialogOpen?: () => void;       
	onCreateOpen?: () => void;
}

export const Searchbox: React.FC<SearchboxProps> = ({ view = 'users', onChange, onDialogOpen, onCreateOpen }) => (
	<SearchboxContainer>
		{/* ── NUEVOS ICONOS ─────────────────────────── */}
		<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
			<IconToggle
				active={view === 'users'}
				aria-label="Usuarios"
				onClick={() => onChange?.('users')}
			>
				<ChatBubbleOutlineIcon fontSize="small" />
			</IconToggle>

			<IconToggle
				active={view === 'groups'}
				aria-label="Grupos"
				onClick={() => onChange?.('groups')}
			>
				<GroupsIcon fontSize="small" />
			</IconToggle>

			<IconToggle
				aria-label="Administrar miembros"
				active={false}          
				onClick={() => onDialogOpen?.()}
			>
				<ManageAccountsIcon fontSize="small" />
			</IconToggle>
			<IconToggle
    aria-label="Crear grupo"
    active={false}
    onClick={() => onCreateOpen?.()}
  >
    <GroupAddIcon fontSize="small" />
  </IconToggle>
		</div>

		{/* barra de búsqueda que ya tenías */}
		<SearchBar>
			{/* … tu input / botón salir … */}
		</SearchBar>
	</SearchboxContainer>
);
;
