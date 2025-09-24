import { ReactNode, ElementType } from 'react';
import { HeaderVariant } from './header.styles';

export interface NavLink {
	label: string;
	to: string;
	icon: ElementType;
	adminOnly?: boolean;
}

export interface HeaderProps {
	logoSrc: string;
	navLinks: NavLink[];
	userRole?: string;
	onLogout?: () => void;
	onNotificationsClick?: (e: React.MouseEvent<HTMLElement>) => void;
	onAvatarClick?: (e: React.MouseEvent<HTMLElement>) => void;
	variant?: HeaderVariant;
	SearchComponent?: React.ReactNode;
}

