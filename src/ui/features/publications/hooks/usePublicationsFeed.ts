// src/ui/features/publications/hooks/usePublicationsFeed.ts
import { useCallback, useState } from 'react';
import { fetchPublications } from '../../../../async/services/publicationService';
import { Publication } from '../../../../types/publication';
import * as R from '../../../../async/routes/publicationRoutes';

type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

interface UseFeedArgs {
	filter: Filter;
	careerId: string;
	query: string;
	/** opcional: filtro por tag (lo puedes pasar desde la página vía URLSearchParams) */
	tag?: string;
}

export const usePublicationsFeed = ({ filter, careerId, query, tag }: UseFeedArgs) => {
	const [pubs, setPubs] = useState<Publication[]>([]);
	const [page, setPage] = useState(1);
	const [more, setMore] = useState(true);
	const [busy, setBusy] = useState(false);

	// devolvemos la ruta base; los params van aparte
	const pathFor = useCallback((): string => {
		if (query.trim()) return R.PUB_SEARCH_BASE;           // '/publications/search'
		if (filter === 'mostLiked') return R.PUBS_MOST_LIKED; // '/publications/most-liked'
		if (filter === 'mostCommented') return R.PUBS_MOST_COMMENT; // '/publications/most-commented'
		if (filter === 'career' && careerId) return R.PUBS_BY_CAREER(careerId); // '/publications/career/:id'
		return R.PUBS;                                        // '/publications'
	}, [filter, careerId, query]);

	const load = useCallback(async (pg: number) => {
		if (busy) return;
		setBusy(true);
		try {
			const basePath = pathFor();

			// construimos los query params según el contexto
			const params: Record<string, any> = { page: pg };

			// cuando hay búsqueda de texto, usamos el endpoint de search
			if (query.trim()) params.query = query.trim();

			// tag es opcional; si viene, se agrega
			if (tag && tag.trim()) params.tag = tag.trim();

			// si filtras por carrera vía endpoint '/career/:id', igual puedes pasar paginación
			if (filter === 'career' && careerId) {
				// ya va en la ruta base; nada extra aquí salvo page
			}

			const { publications = [] } = await fetchPublications(basePath, params);

			setMore(publications.length > 0);

			setPubs(prev => {
				const map = new Map<string, Publication>();
				[...prev, ...publications].forEach(p => map.set(p._id, p));
				const arr = Array.from(map.values());

				if (filter === 'mostLiked') {
					arr.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
				}
				if (filter === 'mostCommented') {
					arr.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
				}
				return arr;
			});
		} catch (e) {
			console.error(e);
		} finally {
			setBusy(false);
		}
	}, [busy, pathFor, filter, careerId, query, tag]);

	return { pubs, setPubs, load, page, setPage, more, busy };
};

