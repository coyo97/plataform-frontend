import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { AuthorProfileContainer, ProfileDetails, ProfileImage } from './authorProfileStyles.styles';
import { Typography, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Career {
	_id: string;
	name: string;
}

interface Profile {
	_id: string;
	username: string;            // nombre (nombre de pila)
	apellidoPaterno?: string;    // nuevo: recibido desde backend
	apellidoMaterno?: string;    // nuevo: recibido desde backend
	// email: string;            // ya NO lo mostraremos
	bio?: string;
	interests?: string[];
	profilePicture?: string;
	careers?: Career[];          // nuevo: para mostrar nombres de carrera
	isFriend?: boolean;
	hasSentRequest?: boolean;
	hasReceivedRequest?: boolean;
}

interface LocationState {
	userProfileId: string;
}

const AuthorProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const locationState = location.state as LocationState;
	const [profile, setProfile] = useState<Profile | null>(null);
	const [friendStatus, setFriendStatus] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [open, setOpen] = useState(false);

	const { HOST, SERVICE } = getEnvVariables();
	const userProfileId = locationState?.userProfileId || id;
	const loggedInUserId = localStorage.getItem('userId');

	useEffect(() => {
		const fetchAuthorProfile = async () => {
			if (!userProfileId) {
				setError('ID de usuario no encontrado');
				setLoading(false);
				return;
			}

			try {
				const response = await axios.get(`${HOST}${SERVICE}/authors/${userProfileId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				if (response.data.author) {
					const profileData = response.data.author as Profile;
					setProfile(profileData);

					// Determinar el estado de amistad
					if (profileData._id === loggedInUserId) {
						setFriendStatus('self');
					} else if (profileData.isFriend) {
						setFriendStatus('friends');
					} else if (profileData.hasSentRequest) {
						setFriendStatus('requestSent');
					} else if (profileData.hasReceivedRequest) {
						setFriendStatus('requestReceived');
					} else {
						setFriendStatus('notFriends');
					}
				}
			} catch (error) {
				console.error('Error fetching author profile:', error);
				setError('Error fetching author profile');
			} finally {
				setLoading(false);
			}
		};

		fetchAuthorProfile();
	}, [userProfileId, HOST, SERVICE, loggedInUserId]);

	const sendFriendRequest = async () => {
		if (!profile) return;

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/users/${profile._id}/send-friend-request`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Solicitud de amistad enviada');
			setFriendStatus('requestSent');
		} catch (error) {
			console.error('Error sending friend request:', error);
			alert('Error al enviar la solicitud de amistad');
		}
	};

	const acceptFriendRequest = async () => {
		if (!profile) return;

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/users/${profile._id}/accept-friend-request`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Solicitud de amistad aceptada');
			setFriendStatus('friends');
		} catch (error) {
			console.error('Error accepting friend request:', error);
			alert('Error al aceptar la solicitud de amistad');
		}
	};

	const rejectFriendRequest = async () => {
		if (!profile) return;

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/users/${profile._id}/reject-friend-request`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Solicitud de amistad rechazada');
			setFriendStatus('notFriends');
		} catch (error) {
			console.error('Error rejecting friend request:', error);
			alert('Error al rechazar la solicitud de amistad');
		}
	};

	const cancelFriendRequest = async () => {
		if (!profile) return;

		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`${HOST}${SERVICE}/users/${profile._id}/cancel-friend-request`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Solicitud de amistad cancelada');
			setFriendStatus('notFriends');
		} catch (error) {
			console.error('Error al cancelar la solicitud de amistad:', error);
			alert('Error al cancelar la solicitud de amistad');
		}
	};

	if (loading) return <p>Cargando perfil...</p>;
	if (error) return <p>{error}</p>;

	// URL de imagen (con fallback)
	const imgSrc =
		profile?.profilePicture ? `${HOST}/${profile.profilePicture}` : 'https://ptetutorials.com/images/user-profile.png';

	// Accesibilidad: permitir abrir con teclado (Enter/Espacio)
	const onImageKeyDown = (e: React.KeyboardEvent) => {
		if (!imgSrc) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setOpen(true);
		}
	};

	const fullName = [
		profile?.username,
		profile?.apellidoPaterno,
		profile?.apellidoMaterno,
	].filter(Boolean).join(' ');

	const careerNames = profile?.careers?.length
		? profile.careers.map(c => c.name).join(', ')
		: 'Sin carrera asignada';

		const interestsText = profile?.interests?.length
			? profile.interests.join(', ')
			: 'No hay intereses listados';

			return (
				<AuthorProfileContainer>
					<Typography variant="h5" component="h1">Perfil del Autor</Typography>

					{profile && (
						<ProfileDetails>
							<Typography variant="body1"><strong>Nombre completo:</strong> {fullName || 'Sin nombre'}</Typography>
							<Typography variant="body1"><strong>Carreras:</strong> {careerNames}</Typography>
							<Typography variant="body1"><strong>Intereses:</strong> {interestsText}</Typography>
							<Typography variant="body1"><strong>Bio:</strong> {profile.bio || 'No hay biografía disponible'}</Typography>

							{/* Imagen clickeable para abrir visor */}
							<ProfileImage
								src={imgSrc}
								alt={profile.username}
								onClick={() => setOpen(true)}
								onKeyDown={onImageKeyDown}
								role="button"
								tabIndex={0}
								style={{ cursor: 'pointer' }}
							/>

							{/* Botones según estado de amistad (sin cambios) */}
							{friendStatus === 'self' && <Typography variant="body1">Este es tu perfil</Typography>}
							{friendStatus === 'friends' && <Typography variant="body1">Ya son amigos</Typography>}
							{friendStatus === 'requestSent' && (
								<div>
									<Typography variant="body1">Solicitud de amistad enviada</Typography>
									<Button variant="outlined" color="secondary" onClick={cancelFriendRequest}>
										Cancelar Solicitud
									</Button>
								</div>
							)}
							{friendStatus === 'requestReceived' && (
								<div>
									<Typography variant="body1">Este usuario te ha enviado una solicitud de amistad</Typography>
									<Button variant="contained" color="primary" onClick={acceptFriendRequest} style={{ marginRight: '10px' }}>
										Aceptar Solicitud
									</Button>
									<Button variant="outlined" color="secondary" onClick={rejectFriendRequest}>
										Rechazar Solicitud
									</Button>
								</div>
							)}
							{friendStatus === 'notFriends' && (
								<Button variant="contained" color="primary" onClick={sendFriendRequest}>
									Añadir Amigo
								</Button>
							)}
						</ProfileDetails>
					)}

					{/* Visor modal tipo lightbox */}
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
								alt={profile?.username || 'Foto de perfil'}
								style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain', display: 'block' }}
							/>
						</DialogContent>
					</Dialog>
				</AuthorProfileContainer>
			);
};

export default AuthorProfile;

