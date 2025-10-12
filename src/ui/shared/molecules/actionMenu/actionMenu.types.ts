export interface ActionMenuProps {
	/** Si es dueño del contenido */
	isOwner: boolean;

	/** Enlace de la publicación */
	link: string;

	/** Callbacks de acciones */
	onEdit?: () => void;
	onDelete?: () => void;
	onReport?: () => void;
	onSave?: () => void;
	onClose?: () => void;
}
;
