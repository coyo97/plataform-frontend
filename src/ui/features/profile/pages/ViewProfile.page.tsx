import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Loader from '../../../shared/atoms/feedback/loader/Loader';
import Alert from '../../../shared/atoms/feedback/alert/Alert';
import { Grid, Paper } from '@mui/material';

import ProfileDetails from '../organisms/ProfileDetails/ProfileDetails';
import FriendRequestsPage from '../../friends/pages/FriendRequests.page';
import FriendsListPage from '../../friends/pages/FriendsList.page';
import Notifications from '../../centerAlert/Notifications';
import UserSearchPage from '../../friends/pages/UserSearch.page';

import { useProfile } from '../hooks/useProfile';

const ViewProfilePage: React.FC = () => {
	const { profile, loading, error } = useProfile();

	if (loading) return <Loader />;
	if (error) return <Alert variant="outlined">{error}</Alert>;
	if (!profile) return null;

	return (
		<Grid container spacing={2} sx={{ p: 3 }}>
			{/* Encabezado del perfil */}
			<Grid item xs={12}>
				<SmartBox center>
					<ProfileDetails profile={profile} />
				</SmartBox>
			</Grid>

			{/* Tarjeta: Solicitudes de amistad */}
			<Grid item xs={12} md={6}>
				<Paper elevation={2} sx={{ p: 2 }}>
					<FriendRequestsPage />
				</Paper>
			</Grid>

			{/* Tarjeta: Notificaciones */}
			<Grid item xs={12} md={6}>
				<Paper elevation={2} sx={{ p: 2 }}>
					<Notifications />
				</Paper>
			</Grid>

			{/* Tarjeta: Lista de amigos */}
			<Grid item xs={12} md={6}>
				<Paper elevation={2} sx={{ p: 2 }}>
					<FriendsListPage />
				</Paper>
			</Grid>

			{/* Tarjeta: Buscar usuarios */}
			<Grid item xs={12} md={6}>
				<Paper elevation={2} sx={{ p: 2 }}>
					<UserSearchPage />
				</Paper>
			</Grid>
		</Grid>
	);
};

export default ViewProfilePage;

