// ui/features/profile/moleculas/ProfileInfo/ProfileInfo.tsx
import React from 'react';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import Text from '../../../../shared/atoms/typography/Text';
import type { UserProfile } from '../../../../../types/profile';

interface Props { data: UserProfile }

const ProfileInfo: React.FC<Props> = ({ data }) => {
	const fullName = `${data.username ?? ''} ${data.apellidoPaterno ?? ''} ${data.apellidoMaterno ?? ''}`.trim();
	const careerNames = data.careers?.length ? data.careers.map(c => c.name).join(', ') : 'Sin carrera asignada';

	return (
		<SmartBox column gap="px4" center>
			<Text weight="medium">Nombre completo:</Text>
			<Text>{fullName || 'Sin nombre'}</Text>

			<Text weight="medium">Carreras:</Text>
			<Text>{careerNames}</Text>

			<Text weight="medium">Bio:</Text>
			<Text>{data.bio || 'Sin biografía'}</Text>

			<Text weight="medium">Intereses:</Text>
			<Text>{data.interests?.length ? data.interests.join(', ') : 'Sin intereses'}</Text>
		</SmartBox>
	);
};

export default ProfileInfo;

