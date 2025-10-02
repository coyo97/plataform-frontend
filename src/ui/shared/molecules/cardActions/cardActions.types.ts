export interface CardActionsProps {
	liked?: boolean;
	likesCount?: number;
	commentsCount?: number;

	showLike?: boolean;
	showComment?: boolean;
	showShare?: boolean;
	showReport?: boolean;

	onLike?: () => void;
	onUnlike?: () => void;
	onComments?: () => void;
	/** 
	 * Debe devolver el link que se va a compartir.
	 * Si no se define, se usará window.location.href por defecto.
	 */
	onShare?: () => string;
	onReport?: () => void;
}

