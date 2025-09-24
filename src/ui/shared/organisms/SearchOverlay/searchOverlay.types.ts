// src/ui/shared/organisms/SearchOverlay/searchOverlay.types.ts
import type { User } from '../../../../types/types';

export type SearchCategory = 'all' | 'people' | 'posts' | 'videos' | 'materials';

export interface SearchResult {
	id: string;
	type: SearchCategory;
	title: string;
	description?: string;
	thumbnail?: string; 
	extra?: any;        
	author?: User;
}

export interface SearchOverlayProps {
	/** Callback que recibe la query */
	onSearch: (query: string, category: SearchCategory) => void;

	/** Placeholder opcional */
	placeholder?: string;

	/** Resultados iniciales (ej: búsquedas recientes) */
	initialResults?: SearchResult[];

	/** Categorías habilitadas en este overlay */
	categories?: SearchCategory[];
}

