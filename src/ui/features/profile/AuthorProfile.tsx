// ui/features/profile/AuthorProfile.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

import { Typography, Button, Dialog, DialogContent, IconButton, Box, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ProfileInfo from './moleculas/ProfileInfo/ProfileInfo';
import type { UserProfile } from '../../../types/profile';

import { AuthorProfileContainer, ProfileDetails, ProfileImage } from './authorProfileStyles.styles';

interface LocationState { userProfileId: string; }

const AuthorProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const locationState = location.state as LocationState | undefined;

	const { HOST, SERVICE } = getEnvVariables();
	const userProfileId = locationState?.userProfileId || id;
	const loggedInUserId = localStorage.getItem('userId');

	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [friendStatus, setFriendStatus] = useState<'self' | 'friends' | 'requestSent' | 'requestReceived' | 'notFriends'>('notFriends');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	const imgSrc = useMemo(() => {
		if (!profile?.profilePicture) return 'https://ptetutorials.com/images/user-profile.png';
			return `${HOST}/${profile.profilePicture}`;
	}, [HOST, profile?.profilePicture]);

	useEffect(() => {
		const fetchAuthorProfile = async () => {
			if (!userProfileId) { setError('ID de usuario no encontrado'); setLoading(false); return; }
			try {
				const response = await axios.get(`${HOST}${SERVICE}/authors/${userProfileId}`, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});

				if (response.data?.author) {
					const p: UserProfile = response.data.author;

					// NO mostrar email a terceros: `ProfileInfo` solo lo muestra si showEmail={true}
					setProfile(p);

					// Estado de amistad
					if (p._id === loggedInUserId)        setFriendStatus('self');
					else if (p.isFriend)                 setFriendStatus('friends');
					else if (p.hasSentRequest)           setFriendStatus('requestSent');
					else if (p.hasReceivedRequest)       setFriendStatus('requestReceived');
					else                                 setFriendStatus('notFriends');
				}
			} catch (e) {
				console.error('Error fetching author profile:', e);
				setError('Error fetching author profile');
			} finally {
				setLoading(false);
			}
		};
		fetchAuthorProfile();
	}, [HOST, SERVICE, userProfileId, loggedInUserId]);

	const withAuthPost = async (url: string) => {
		const token = localStorage.getItem('token');
		await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
	};

	const sendFriendRequest = async () => {
		if (!profile) return;
		try {
			await withAuthPost(`${HOST}${SERVICE}/users/${profile._id}/send-friend-request`);
			setFriendStatus('requestSent');
		} catch (e) { console.error(e); alert('Error al enviar la solicitud de amistad'); }
	};

	const acceptFriendRequest = async () => {
		if (!profile) return;
		try {
			await withAuthPost(`${HOST}${SERVICE}/users/${profile._id}/accept-friend-request`);
			setFriendStatus('friends');
		} catch (e) { console.error(e); alert('Error al aceptar la solicitud de amistad'); }
	};

	const rejectFriendRequest = async () => {
		if (!profile) return;
		try {
			await withAuthPost(`${HOST}${SERVICE}/users/${profile._id}/reject-friend-request`);
			setFriendStatus('notFriends');
		} catch (e) { console.error(e); alert('Error al rechazar la solicitud de amistad'); }
	};

	const cancelFriendRequest = async () => {
		if (!profile) return;
		try {
			await withAuthPost(`${HOST}${SERVICE}/users/${profile._id}/cancel-friend-request`);
			setFriendStatus('notFriends');
		} catch (e) { console.error(e); alert('Error al cancelar la solicitud de amistad'); }
	};

	const onImageKeyDown = (e: React.KeyboardEvent) => {
		if (!imgSrc) return;
		if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
	};

	if (loading) return <p>Cargando perfil...</p>;
	if (error)   return <p>{error}</p>;
	if (!profile) return <p>No se encontró el perfil.</p>;

	return (
		<AuthorProfileContainer>
			<Typography variant="h5" component="h1">Perfil del Autor</Typography>

			<ProfileDetails>
				<Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
					<ProfileImage
						src={imgSrc}
						alt={profile.username}
						onClick={() => setOpen(true)}
						onKeyDown={onImageKeyDown}
						role="button"
						tabIndex={0}
						style={{ cursor: 'pointer' }}
					/>
					<Box>
						{friendStatus === 'self' && <Typography variant="body2">Este es tu perfil</Typography>}
						{friendStatus === 'friends' && <Typography variant="body2">Ya son amigos</Typography>}
						{friendStatus === 'requestSent' && (
							<Stack direction="row" spacing={1} alignItems="center">
								<Typography variant="body2">Solicitud enviada</Typography>
								<Button variant="outlined" color="secondary" onClick={cancelFriendRequest}>Cancelar</Button>
							</Stack>
						)}
						{friendStatus === 'requestReceived' && (
							<Stack direction="row" spacing={1}>
								<Button variant="contained" color="primary" onClick={acceptFriendRequest}>Aceptar</Button>
								<Button variant="outlined" color="secondary" onClick={rejectFriendRequest}>Rechazar</Button>
							</Stack>
						)}
						{friendStatus === 'notFriends' && (
							<Button variant="contained" color="primary" onClick={sendFriendRequest}>Añadir Amigo</Button>
						)}
					</Box>
				</Stack>

				<ProfileInfo data={profile} showEmail={false} />
			</ProfileDetails>

			<Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
				<IconButton
					aria-label="Cerrar"
					onClick={() => setOpen(false)}
					sx={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 1 }}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent sx={{ p: 0, background: 'black' }}>
					<img
						src={imgSrc}
						alt={profile.username || 'Foto de perfil'}
						style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain', display: 'block' }}
					/>
				</DialogContent>
			</Dialog>
		</AuthorProfileContainer>
	);
};

export default AuthorProfile;

