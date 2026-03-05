// src/ui/shared/organisms/commentCard/commentCard.types.ts
import { ReactNode, CSSProperties } from 'react';

export interface CommentAuthor {
	id?: string;
	name: string;
	avatarUrl?: string;
}

export interface CommentCardProps {
	// autor
	author?: CommentAuthor;
	date?: string | Date;
	/** Si quieres forzar un subtítulo tipo "hace 2 horas" en lugar de DateTimeInfo */
	subtitle?: string;
	showAvatar?: boolean;

	// contenido
	content?: ReactNode | string;
	/** Máximo de líneas visibles para texto plano (opcional) */
	maxLines?: number;
	children?: ReactNode;

	// solución
	solved?: boolean;
	canSolve?: boolean;
	onSolve?: () => void;

	// votos
	votes?: number;
	onVote?: () => void;

	// estado de dueño / acciones
	isOwner?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;

	// adjuntos / extras
	attachment?: ReactNode;
	headerActions?: ReactNode;

	className?: string;
	style?: CSSProperties;
}

