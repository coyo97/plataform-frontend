// ui/features/profile/hooks/useProfile.ts
import { useEffect, useState } from 'react';
import type { UserProfile } from '../../../../types/profile';
import { fetchMyProfile } from '../../../../async/services/userProfileService';

export const useProfile = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error,   setError]   = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setProfile(await fetchMyProfile());
			} catch {
				setError('Usted aún no actualizó su perfil');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return { profile, loading, error };
};

