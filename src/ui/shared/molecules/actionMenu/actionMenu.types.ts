export interface ActionMenuProps {
	isOwner: boolean;
	link: string;

	onEdit?: () => void;
	onDelete?: () => void;
	onReport?: () => void;
	onSave?: () => void;
	onClose?: () => void;

	canEdit?: boolean;
	canDelete?: boolean;
	canSave?: boolean;
	canReport?: boolean;
	onPermissionDenied?: (message: string) => void;
}

