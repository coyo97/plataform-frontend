// ui/features/profile/pages/UpdateProfile.page.tsx
import React, { useState , useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import TextField from '../../../shared/atoms/textFields/TextField';
import Text from '../../../shared/atoms/typography/Text';

import { updateMyProfile } from '../../../../async/services/userProfileService';
import { FormWrapper } from './updateProfileForm.styles';

import { Alert, AlertTitle, Box } from '@mui/material';

const UpdateProfilePage: React.FC = () => {
	const [bio, setBio] = useState('');
	const [interests, setInterests] = useState('');
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setProfilePicture(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData();

		// Solo adjunta lo que el usuario llenó
		if (bio.trim().length > 0) {
			formData.append('bio', bio);
		}
		if (interests.trim().length > 0) {
			const arr = interests.split(',').map(i => i.trim()).filter(Boolean);
			formData.append('interests', JSON.stringify(arr));
		}
		if (profilePicture) {
			formData.append('file', profilePicture);
		}

		if ([...formData.keys()].length === 0) {
			alert('No hay cambios para actualizar');
			return;
		}

		try {
			await updateMyProfile(formData);
			alert('Perfil actualizado con éxito');
			setBio('');
			setInterests('');
			setProfilePicture(null);
			setPreviewUrl(null);
			if (fileInput.current) fileInput.current.value = '';
			// navigate('/mi-perfil');
		} catch (error) {
			console.error('Error al actualizar el perfil:', error);
			alert('Ocurrió un error al actualizar el perfil');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<FormWrapper>
				<Text as="h2" size="lg" weight="bold" sx={{ textAlign: 'center' }}>
					Actualizar Perfil
				</Text>

				{/* Instrucciones claras */}
				<Alert severity="info" sx={{ mt: 1 }}>
					<AlertTitle>Consejo</AlertTitle>
					Puedes actualizar <strong>solo</strong> los campos que desees:
					<ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18 }}>
						<li><strong>Solo foto:</strong> pulsa “Seleccionar Foto de Perfil” y envía.</li>
						<li><strong>Solo biografía:</strong> escribe la bio y envía (sin seleccionar imagen).</li>
						<li><strong>Solo intereses:</strong> escribe intereses separados por comas y envía.</li>
						<li>También puedes combinar (por ej. foto + bio).</li>
					</ul>
				</Alert>

				<TextField
					label="Bio"
					multiline
					rows={4}
					value={bio}
					onChange={(e)=>setBio(e)}
					helperText="Ej.: Estudiante de Sistemas, me interesan los proyectos open-source."
				/>

				<TextField
					label="Intereses (separados por comas)"
					value={interests}
					onChange={setInterests}
					helperText="Ej.: programación, IA, bases de datos"
				/>

				<input
					ref={fileInput}
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>

				<FilledButton
					type="button"
					colorType="info"
					btnVariant="outline"
					onClick={() => fileInput.current?.click()}
				>
					{profilePicture ? 'Cambiar Foto de Perfil' : 'Seleccionar Foto de Perfil'}
				</FilledButton>

				{previewUrl && (
					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<img
							src={previewUrl}
							alt="Vista previa"
							style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
						/>
					</Box>
				)}

				<FilledButton type="submit" fullWidth colorType="success" sx={{ mt: 2 }}>
					Actualizar Perfil
				</FilledButton>
			</FormWrapper>
		</form>
	);
};

export default UpdateProfilePage;

