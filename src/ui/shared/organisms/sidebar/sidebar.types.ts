import { ReactNode } from 'react';

export type SidebarVariant = 'default' | 'primary' | 'surface' | 'elevated' | 'flat' | 'modal';
export type SidebarPosition = 'left' | 'right';

export interface SidebarProps {
	open?: boolean;                // visible en móviles
	onClose?: () => void;          // callback al cerrar (overlay o Esc)
	sticky?: boolean;              // mantiene posición sticky
	width?: number | string;       // ancho – por defecto 250 px
	variant?: SidebarVariant;      // estilo visual (incluye modal)
	header?: ReactNode;            // contenido opcional en header
	footer?: ReactNode;            // contenido opcional en footer
	children: ReactNode;           // navegación, filtros, etc.
	position?: SidebarPosition;    // lado (left o right)
	ariaLabel?: string;            // accesibilidad
}

