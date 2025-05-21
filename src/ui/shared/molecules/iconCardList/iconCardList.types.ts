import { ReactNode } from 'react';

export interface IconCardItemData {
	id          : string;
	title       : string;
	subtitle?   : string;
	description?: string;
	icon?       : ReactNode;
	selected?   : boolean;          // modo controlado opcional
}

export interface IconCardListProps {
	items      : IconCardItemData[];
	/** Si se pasa, el componente es controlado */
	selectedIds?: string[];
	/** Callback cuando cambia selección de una tarjeta */
	onSelect?  : (id: string, selected: boolean) => void;
	className? : string;
}

