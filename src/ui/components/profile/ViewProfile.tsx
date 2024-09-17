// src/components/ViewProfile.tsx
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../../async/services/profileService';
import getEnvVariables from '../../../config/configEnvs';

interface Profile {
	bio?: string;
	interests?: string[];
	profilePicture?: string; // Ruta de la imagen
}

const ViewProfile: React.FC = () => {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const {HOST} = getEnvVariables();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await getUserProfile();
				setProfile(data.profile);
			} catch (error) {
				console.error('Error fetching profile:', error);
				setError('Error fetching profile');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			<h1>Profile</h1>
			{profile && (
				<div>
					<p><strong>Bio:</strong> {profile.bio || 'No bio available'}</p>
					<p><strong>Interests:</strong> {profile.interests ? profile.interests.join(', ') : 'No interests listed'}</p>
					{profile.profilePicture && (
						<img
							src={`${HOST}/${profile.profilePicture}`} // Asegúrate de que la ruta del backend esté correcta
							alt="Profile"
							style={{ width: '150px', height: '150px', objectFit: 'cover' }}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default ViewProfile;

