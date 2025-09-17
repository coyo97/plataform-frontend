//sidebar2

import {ReactNode} from "react";

export type SidebarVariant = 'default' | 'primary' | 'surface' | 'elevated' | 'flat';
export type SidebarPosition = 'left' | 'right';

export interface SidebarProps {
	open?: boolean;
	onClose?: () => void;
	sticky?: boolean;
	width?: number | string;
	variant?: SidebarVariant;
	position?: SidebarPosition;
	header?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
}
