// src/ui/components/profile/AuthorProfile.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

interface Profile {
	username: string;
	email: string;
	bio?: string;
	interests?: string[];
	profilePicture?: string; // Ruta de la imagen
}

interface LocationState {
	userProfileId: string;
}

const AuthorProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>(); // ID desde la URL
	const location = useLocation(); // No usamos genéricos aquí directamente
	const locationState = location.state as LocationState; // Cast del estado
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Utiliza el ID del estado si está disponible, de lo contrario utiliza el ID de la URL
	const userProfileId = locationState?.userProfileId || id;

	useEffect(() => {
		const fetchAuthorProfile = async () => {
			if (!userProfileId) {
				setError('ID de usuario no encontrado');
				setLoading(false);
				return;
			}

			try {
				const response = await axios.get(`http://localhost:8000/v1.0/api/authors/${userProfileId}`, {
					headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				});
				setProfile(response.data.author);
			} catch (error) {
				console.error('Error fetching author profile:', error);
				setError('Error fetching author profile');
			} finally {
				setLoading(false);
			}
		};

		fetchAuthorProfile();
	}, [userProfileId]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			<h1>Perfil del Autor</h1>
			{profile && (
				<div>
					<p><strong>Username:</strong> {profile.username}</p>
					<p><strong>Email:</strong> {profile.email}</p>
					<p><strong>Bio:</strong> {profile.bio || 'No bio available'}</p>
					<p><strong>Interests:</strong> {profile.interests ? profile.interests.join(', ') : 'No interests listed'}</p>
					{profile.profilePicture && (
						<img
							src={`http://localhost:8000/${profile.profilePicture}`} // Asegúrate de que la ruta del backend esté correcta
							alt="Profile"
							style={{ width: '150px', height: '150px', objectFit: 'cover' }}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default AuthorProfile;

