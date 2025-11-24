import { useEffect, useRef, useState } from 'react';
import {
	fetchHelpRequests,
	fetchMyHelpRequests,
} from '../../../../async/services/academicHelpService';
import { AcademicHelp } from '../../../../types/academicHelp';

type RawFilters = Parameters<typeof fetchHelpRequests>[0];
export type HelpFilters = NonNullable<RawFilters> & {
	status?: 'open' | 'resolved';
	owner?: 'me' | 'all';
};

export const useHelpFeed = () => {
	const [helps, setHelps] = useState<AcademicHelp[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<HelpFilters>({});

	const debounceTimer = useRef<number | null>(null);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			try {
				const isMine = filters.owner === 'me';
				const data = isMine
					? await fetchMyHelpRequests()
					: await fetchHelpRequests(filters);

					if (!cancelled) setHelps(data ?? []);
			} catch (e) {
				console.error(e);
				if (!cancelled) setHelps([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
		debounceTimer.current = window.setTimeout(run, 250);

		return () => {
			cancelled = true;
			if (debounceTimer.current) {
				window.clearTimeout(debounceTimer.current);
				debounceTimer.current = null;
			}
		};
	}, [filters]);

	const reload = () => setFilters({ ...filters });

	return { helps, setHelps, loading, reload, setFilters, filters };
};

