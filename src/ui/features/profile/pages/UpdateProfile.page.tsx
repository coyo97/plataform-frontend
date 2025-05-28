import React, { useState , useRef} from 'react';
import { useNavigate } from 'react-router-dom';

import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import TextField from '../../../shared/atoms/textFields/TextField';
import Text from '../../../shared/atoms/typography/Text';

import { updateMyProfile } from '../../../../async/services/userProfileService';
import { FormWrapper } from './updateProfileForm.styles';

const UpdateProfilePage: React.FC = () => {
	const [bio, setBio] = useState('');
	const [interests, setInterests] = useState('');
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);

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
		formData.append('interests', JSON.stringify(interests.split(',').map(i => i.trim())));
		if (profilePicture) {
			formData.append('file', profilePicture);
		}

		try {
			await updateMyProfile(formData);
			alert('✅ Perfil actualizado con éxito');
			// Limpiar el formulario
			setBio('');
			setInterests('');
			setProfilePicture(null);
			if (fileInput.current) {
				fileInput.current.value = ''; // limpiar el input file
			}
		} catch (error) {
			console.error('❌ Error al actualizar el perfil:', error);
			alert('❌ Ocurrió un error al actualizar el perfil');
		}


	};

	return (
		<form onSubmit={handleSubmit}>
			<FormWrapper>
				<Text as="h2" size="lg" weight="bold" sx={{ textAlign: 'center' }}>
					Actualizar Perfil
				</Text>

				<TextField
					label="Bio"
					multiline
					rows={4}
					value={bio}
					onChange={(e)=>setBio(e)}
				/>

				<TextField
					label="Intereses (separados por comas)"
					value={interests}
					onChange={setInterests}
				/>


				<input
					ref={fileInput}
					type="file"
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>

				<FilledButton
					type="button"
					colorType="info"
					btnVariant="outline"
					onClick={() => fileInput.current?.click()}
				>
					{profilePicture ? 'Archivo seleccionado' : 'Seleccionar Foto de Perfil'}
				</FilledButton>

				<FilledButton type="submit" fullWidth colorType="success">
					Actualizar Perfil
				</FilledButton>
			</FormWrapper>
		</form>
	);
};

export default UpdateProfilePage;

