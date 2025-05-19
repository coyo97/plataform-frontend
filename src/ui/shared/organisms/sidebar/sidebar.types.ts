// sidebar.types.ts
import { ReactNode } from 'react';

export type SidebarVariant = 'default' | 'primary' | 'surface' | 'elevated';
export type SidebarPosition = 'left' | 'right';

export interface SidebarProps {
	/** visible en móviles */
	open?: boolean;
	/** callback al cerrar (overlay o Esc) */
	onClose?: () => void;
	/** mantiene posición sticky dentro del grid */
	sticky?: boolean;
	/** ancho – por defecto 250 px */
	width?: number | string;
	/** color / elevación */
	variant?: SidebarVariant;
	/** header opcional (título/logo) */
	header?: ReactNode;
	/** footer opcional (copyright, logo) */
	footer?: ReactNode;
	/** children = navegación, filtros, etc.  */
	children: ReactNode;
	/** ‘left’ (default) o ‘right’ */
	position?: SidebarPosition;
}

