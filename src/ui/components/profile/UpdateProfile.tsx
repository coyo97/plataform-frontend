// src/components/UpdateProfile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../async/services/profileService';

const UpdateProfile: React.FC = () => {
	const [bio, setBio] = useState('');
	const [interests, setInterests] = useState('');
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const navigate = useNavigate();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setProfilePicture(e.target.files[0]);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('bio', bio);
		// Convertir el array de intereses a una cadena JSON antes de añadirlo al FormData
		formData.append('interests', JSON.stringify(interests.split(',').map(item => item.trim())));
		if (profilePicture) {
			formData.append('profilePicture', profilePicture);
		}

		try {
			await updateUserProfile(formData);
			alert('Perfil actualizado con éxito');
			navigate('/profile'); // Redirigir a la página del perfil o mostrar un mensaje de éxito
		} catch (error) {
			console.error('Error al actualizar el perfil:', error);
			alert('Error al actualizar el perfil');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				placeholder="Bio"
				value={bio}
				onChange={(e) => setBio(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Interests (comma separated)"
				value={interests}
				onChange={(e) => setInterests(e.target.value)}
			/>
			<input
				type="file"
				onChange={handleFileChange} // Manejador de cambio de archivo
			/>
			<button type="submit">Actualizar Perfil</button>
		</form>
	);
};

export default UpdateProfile;

