// ui/features/profile/organisms/ProfileDetails/ProfileDetails.tsx
import React from 'react';
import getEnvVariables from '../../../../../config/configEnvs';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import SectionTitle from '../../../../shared/atoms/titles/SectionTitle';
import ProfileAvatar from '../../atoms/profileAvatar/ProfileAvatar';
import ProfileInfo from '../../moleculas/ProfileInfo/ProfileInfo';
import type { UserProfile } from '../../../../../types/profile';

interface Props { profile: UserProfile }
const ProfileDetails: React.FC<Props> = ({ profile }) => {
	const { HOST } = getEnvVariables();
	const src = profile.profilePicture ? `${HOST}/${profile.profilePicture}` : undefined;

	return (
		<SmartBox column gap="px10" center radius="md2x" shadow="md" p="px12">
			<SectionTitle>Perfil</SectionTitle>
			<ProfileAvatar src={src} />
			<ProfileInfo data={profile} />
		</SmartBox>
	);
};
export default ProfileDetails;

