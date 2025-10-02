import { ReactNode } from 'react';

export interface CardAuthor {
	name: string;
	avatarUrl?: string;
	subtitle?: string; // Ej: rol, carrera, etc.
}

export interface CardProps {
	title?: string;
	description?: string;
	author?: CardAuthor;
	date?: string | Date;
	tags?: string[];
	media?: ReactNode;   // Imagen, video o lo que se quiera renderizar
	actions?: ReactNode; // Botones de like, comentar, compartir
	footer?: ReactNode;  // Opcional: secciones extra (ej. estadísticas)
	onClickAuthor?: () => void;
}

