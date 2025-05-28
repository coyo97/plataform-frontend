// ui/features/profile/moleculas/ProfileInfo/ProfileInfo.tsx
import React from 'react';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import Text from '../../../../shared/atoms/typography/Text';
import type { UserProfile } from '../../../../../types/profile';

interface Props { data: UserProfile }
const ProfileInfo: React.FC<Props> = ({ data }) => (
	<SmartBox column gap="px4" center>
		<Text weight="medium">Bio:</Text>
		<Text>{data.bio || 'Sin biografía'}</Text>

		<Text weight="medium">Intereses:</Text>
		<Text>
			{data.interests?.length ? data.interests.join(', ') : 'Sin intereses'}
		</Text>
	</SmartBox>
);
export default ProfileInfo;

