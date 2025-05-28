// ui/features/profile/pages/ViewProfile.page.tsx
import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Loader from '../../../shared/atoms/feedback/loader/Loader';
import Alert from '../../../shared/atoms/feedback/alert/Alert';
import ProfileDetails from '../organisms/ProfileDetails/ProfileDetails';
import { useProfile } from '../hooks/useProfile';

const ViewProfilePage: React.FC = () => {
	const { profile, loading, error } = useProfile();

	if (loading) return <Loader />
	if (error)   return <Alert variant="outlined">{error}</Alert>;
	if (!profile) return null;

	return (
		<SmartBox center>
			<ProfileDetails profile={profile} />
		</SmartBox>
	);
};
export default ViewProfilePage;

