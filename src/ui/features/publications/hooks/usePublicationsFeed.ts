import { useCallback, useState } from 'react';
import { fetchPublications } from '../../../../async/services/publicationService';
import { Publication } from '../../../../types/publication';
import * as R from '../../../../async/routes/publicationRoutes';

type Filter = 'mostRecent' | 'mostLiked' | 'mostCommented' | 'career';

interface UseFeedArgs {
	filter: Filter;
	careerId: string;
	query: string;
}

export const usePublicationsFeed = ({ filter, careerId, query }: UseFeedArgs) => {
	const [pubs, setPubs] = useState<Publication[]>([]);
	const [page, setPage] = useState(1);
	const [more, setMore] = useState(true);
	const [busy, setBusy] = useState(false);

	const pathFor = useCallback((pg: number) => {
		if (query.trim()) return `${R.PUB_SEARCH(query)}&page=${pg}`;
		if (filter === 'mostLiked') return `${R.PUBS_MOST_LIKED}?page=${pg}`;
		if (filter === 'mostCommented') return `${R.PUBS_MOST_COMMENT}?page=${pg}`;
		if (filter === 'career' && careerId) return `${R.PUBS_BY_CAREER(careerId)}?page=${pg}`;
		return `${R.PUBS}?page=${pg}`;
	}, [filter, careerId, query]);

	const load = useCallback(async (pg: number) => {
		if (busy) return;
		setBusy(true);
		try {
			const data = await fetchPublications(pathFor(pg));
			setMore(data.length > 0);
			setPubs(prev => {
				const map = new Map<string, Publication>();
				[...prev, ...data].forEach(p => map.set(p._id, p));
				const arr = Array.from(map.values());
				if (filter === 'mostLiked')
					arr.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
				if (filter === 'mostCommented')
					arr.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
				return arr;
			});
		} catch (e) {
			console.error(e);
		} finally {
			setBusy(false);
		}
	}, [busy, pathFor, filter]);

	return { pubs, setPubs, load, page, setPage, more, busy };
};

