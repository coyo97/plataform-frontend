// ui/features/profile/pages/UpdateProfile.page.tsx
import React, { useState, useRef, useEffect } from 'react';
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

	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// flag que indica si el backend ya nos devolvió 403 (bloqueo)
	const [forbidden, setForbidden] = useState<boolean>(() => {
		try {
			return localStorage.getItem('profile:update:forbidden') === '1';
		} catch {
			return false;
		}
	});

	const fileInput = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	// Si en otro punto de la app se marca el 403, reflejarlo aquí en vivo
	useEffect(() => {
		const onForbidden = () => setForbidden(true);
		window.addEventListener('profile:update:forbidden' as any, onForbidden);
		return () => {
			window.removeEventListener('profile:update:forbidden' as any, onForbidden);
		};
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setProfilePicture(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const parseApiErrorMessage = (e: any): string => {
		const serverMsg = e?.response?.data?.message || e?.message || '';
		if (
			/moderaci[oó]n|toxicity|lenguaje inapropiado|contenido inapropiado|inappropriate/i.test(
				serverMsg
			)
		) {
			return 'El contenido fue bloqueado por moderación. Revisa que la biografía e intereses cumplan las políticas.';
		}
		if (e?.response?.status === 400 && serverMsg) return serverMsg;
		return 'No se pudo actualizar el perfil. Inténtalo nuevamente.';
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMsg(null);

		// Si ya está bloqueado, evitamos enviar
		if (forbidden) {
			setErrorMsg('No tienes permisos para realizar esta acción.');
			return;
		}

		const formData = new FormData();

		if (bio.trim().length > 0) formData.append('bio', bio);
		if (interests.trim().length > 0) {
			const arr = interests
			.split(',')
			.map((i) => i.trim())
			.filter(Boolean);
			formData.append('interests', JSON.stringify(arr));
		}
		if (profilePicture) formData.append('file', profilePicture);

		if ([...formData.keys()].length === 0) {
			setErrorMsg('No hay cambios para actualizar.');
			return;
		}

		try {
			setSubmitting(true);
			await updateMyProfile(formData);

			// Limpieza local
			setBio('');
			setInterests('');
			setProfilePicture(null);
			setPreviewUrl(null);
			if (fileInput.current) fileInput.current.value = '';

			// Si usas navegación tras éxito, puedes activarla
			// navigate('/mi-perfil');
		} catch (error: any) {
			console.error('Error al actualizar el perfil:', error);

			// Captura 403: bloquea en caliente esta vista y notifica al sidebar
			if (error?.status === 403) {
				setErrorMsg('No tienes permisos para realizar esta acción.');
				setForbidden(true);
				try {
					localStorage.setItem('profile:update:forbidden', '1');
					window.dispatchEvent(new CustomEvent('profile:update:forbidden'));
				} catch {}
				return;
			}

			setErrorMsg(parseApiErrorMessage(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<FormWrapper>
				{/* Banner de error (permisos, moderación u otros) */}
				{errorMsg && (
					<Alert severity="warning" onClose={() => setErrorMsg(null)} sx={{ width: '100%' }}>
						{errorMsg}
					</Alert>
				)}

				{/* Si está bloqueado por 403, mostramos aviso fijo arriba */}
				{forbidden && !errorMsg && (
					<Alert severity="warning" sx={{ width: '100%' }}>
						No tienes permisos para editar el perfil.
					</Alert>
				)}

				<Text as="h2" size="lg" weight="bold" sx={{ textAlign: 'center' }}>
					Actualizar Perfil
				</Text>

				{/* Instrucciones */}
				<Alert severity="info" sx={{ mt: 1 }}>
					<AlertTitle>Consejo</AlertTitle>
					Puedes actualizar <strong>solo</strong> los campos que desees, o todos:
				</Alert>

				<TextField
					label="Bio"
					multiline
					rows={4}
					value={bio}
					onChange={(e) => setBio(e)}
					helperText="Ej.: Estudiante de Sistemas, me interesan los proyectos open-source."
					disabled={forbidden}
				/>

				<TextField
					label="Intereses (separados por comas)"
					value={interests}
					onChange={setInterests}
					helperText="Ej.: programación, IA, bases de datos"
					disabled={forbidden}
				/>

				<input
					ref={fileInput}
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={handleFileChange}
					disabled={forbidden}
				/>

				<FilledButton
					type="button"
					colorType="info"
					btnVariant="outline"
					onClick={() => fileInput.current?.click()}
					disabled={forbidden}
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

				<FilledButton
					type="submit"
					fullWidth
					colorType="success"
					sx={{ mt: 2 }}
					disabled={submitting || forbidden}
				>
					{forbidden ? 'Sin permisos' : submitting ? 'Actualizando…' : 'Actualizar Perfil'}
				</FilledButton>
			</FormWrapper>
		</form>
	);
};

export default UpdateProfilePage;

