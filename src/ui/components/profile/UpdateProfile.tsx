// src/ui/components/profile/UpdateProfile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../async/services/profileService';
import { FormContainer, StyledTextField, StyledButton, Title } from './updateProfile.styles';

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
		formData.append('interests', JSON.stringify(interests.split(',').map(item => item.trim())));
		if (profilePicture) {
			formData.append('file', profilePicture);
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
			<FormContainer>
				<Title variant="h5">Actualizar Perfil</Title>
				<StyledTextField
					label="Bio"
					multiline
					rows={4}
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					variant="outlined"
				/>
				<StyledTextField
					label="Intereses (separados por comas)"
					value={interests}
					onChange={(e) => setInterests(e.target.value)}
					variant="outlined"
				/>
				<StyledTextField
					type="file"
					onChange={handleFileChange}
					InputLabelProps={{ shrink: true }}
					variant="outlined"
				/>
				<StyledButton type="submit" variant="contained">
					Actualizar Perfil
				</StyledButton>
			</FormContainer>
		</form>
	);
};

export default UpdateProfile;

