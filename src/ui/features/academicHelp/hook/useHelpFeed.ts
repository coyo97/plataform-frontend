import { useEffect, useState } from 'react';
import { fetchHelpRequests } from '../../../../async/services/academicHelpService';
import { AcademicHelp } from '../../../../types/academicHelp';

type RawFilters   = Parameters<typeof fetchHelpRequests>[0];
export type HelpFilters = NonNullable<RawFilters> & {
  status?: 'open' | 'resolved';
};

export const useHelpFeed = () => {
	const [helps, setHelps] = useState<AcademicHelp[]>([]);   // siempre array
	const [loading, setLoading] = useState(true);
	const [filters, setFilt ] = useState<HelpFilters>({});   // ⬅

	const load = async () => {
		setLoading(true);
		try {
			const data = await fetchHelpRequests();        // devuelve AcademicHelp[]
			setHelps(data ?? []);                          // fallback []
		} catch (e) {
			console.error(e);
			setHelps([]);                                  // evita undefined
		} finally {
			setLoading(false);
		}
	};

	/* Primera carga */
	useEffect(() => { load(); }, []);

	useEffect(()=>{
		setLoading(true);
		fetchHelpRequests(filters)
		.then(setHelps)
		.finally(()=>setLoading(false));
	},[filters]);

	return { helps, setHelps, loading, reload: load, setFilters:setFilt, filters  }; // ← exporta setHelps
};

