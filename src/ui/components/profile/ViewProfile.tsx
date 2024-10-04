// src/components/ViewProfile.tsx
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../../async/services/profileService';
import getEnvVariables from '../../../config/configEnvs';

import { ProfileContainer, ProfileInfo, ProfileImage } from './viewProfileStyles.styles'; // Importar los estilos

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
		<ProfileContainer>
			<h1>Profile</h1>
			{profile && (
				<ProfileInfo>
					<p><strong>Bio:</strong> {profile.bio || 'No bio available'}</p>
					<p><strong>Interests:</strong> {profile.interests ? profile.interests.join(', ') : 'No interests listed'}</p>
					{profile.profilePicture && (
						<ProfileImage
							src={`${HOST}/${profile.profilePicture}`}
							alt="Profile"
						/>
					)}
				</ProfileInfo>
			)}
		</ProfileContainer>
	);

};

export default ViewProfile;

