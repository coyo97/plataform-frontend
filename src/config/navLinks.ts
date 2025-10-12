
// src/config/navLinks.ts
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export interface NavLink {
	label: string;
	to: string;
	icon: React.ElementType; 
	adminOnly?: boolean;
}

export const navLinks: NavLink[] = [
	{ label: 'Administrador', to: '/administrator', icon: AdminPanelSettingsIcon, adminOnly: true },
	{ label: 'Estudiante', to: '/profile', icon: SchoolIcon },
	//{ label: 'Material', to: '/material-user', icon: ArticleIcon },
	{ label: 'Mensajería', to: '/message', icon: ChatIcon },
	{ label: 'Stream', to: '/stream-academi', icon: LiveTvIcon },
	{ label: 'Publicaciones', to: '/publications', icon: ArticleIcon },
	{ label: 'Ayuda Académica', to: '/academic-help', icon: HelpIcon },
];

