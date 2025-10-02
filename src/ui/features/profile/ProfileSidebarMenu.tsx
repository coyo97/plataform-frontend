// features/profile/components/ProfileSidebarMenu.tsx
import React from 'react';
import Sidebar from '../../shared/organisms/sidebar/Sidebar';
import Text from '../../shared/atoms/typography/Text';
import NavButton from '../../shared/atoms/buttons/navButton/NavButton';
import { Person, Edit, Group, Search, Block, Notifications } from '@mui/icons-material';
import TextItemRow from '../../shared/molecules/items/TextItemRow';

interface Props {
	open: boolean;
	onClose?: () => void;
	onSelect: (section: string) => void;
	selectedSection: string;
}

const menuItems = [
	{ label: 'Ver Perfil', value: 'viewProfile', icon: <Person /> },
	{ label: 'Actualizar Perfil', value: 'updateProfile', icon: <Edit /> },
	{ label: 'Solicitudes de Amistad', value: 'friendRequests', icon: <Group /> },
	{ label: 'Buscar Usuarios', value: 'userSearch', icon: <Search /> },
	{ label: 'Lista de Amigos', value: 'friendsList', icon: <Group /> },
	{ label: 'Usuarios Bloqueados', value: 'blockedUsersList', icon: <Block /> },
	{ label: 'Notificaciones', value: 'notifications', icon: <Notifications /> },
];

const ProfileSidebarMenu: React.FC<Props> = ({ open, onClose, onSelect, selectedSection }) => {
	return (
		<Sidebar
			open={open}
			onClose={onClose}
			variant="elevated"     
			width={250}
			position="left"
			sticky                
		>
			{menuItems.map(({ label, value, icon }) => (
				<TextItemRow
					key={value}
					icon={icon}
					label={label}
					selected={selectedSection === value}
					onClick={() => onSelect(value)}
				/>
			))}
		</Sidebar>
	);
};

export default ProfileSidebarMenu;

