import { ReactNode, ElementType } from 'react';
import { HeaderVariant } from './header.styles';
import type { UserProfile } from '../../../../types/profile';

export interface NavLink {
	label: string;
	to: string;
	icon: ElementType;
	adminOnly?: boolean;
}
export type MinimalUserLike = {
  username?: string;
  profile?: { profilePicture?: string };
  profilePicture?: string;
};

interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
	profilePicture?: string;
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
	  profile?: UserProfile;
  item?: MinimalUserLike;
}

