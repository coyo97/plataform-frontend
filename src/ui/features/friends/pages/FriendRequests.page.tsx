import React from 'react';
import { useFriendRequests } from '../hooks/useFriendRequests';

import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import Alert from '../../../shared/atoms/feedback/alert/Alert';

const FriendRequestsPage: React.FC = () => {
	const { list, message, accept, reject } = useFriendRequests();

	return (
		<SmartBox column gap="px8" p="px12" radius="md2x" shadow="md">
			<Text as="h2" size="lg" weight="bold">Solicitudes de amistad</Text>

			{message && <Alert type="info">{message}</Alert>}

			{list.map(req => (
				<SmartBox key={req._id} between center p="px6" radius="sm2x" shadow="xs">
					<Text weight="medium">{req.username}</Text>

					<SmartBox row gap="px4">
						<FilledButton colorType="success" btnVariant="soft" onClick={() => accept(req._id)}>
							Aceptar
						</FilledButton>
						<FilledButton colorType="error" btnVariant="soft" onClick={() => reject(req._id)}>
							Rechazar
						</FilledButton>
					</SmartBox>
				</SmartBox>
			))}
		</SmartBox>
	);
};

export default FriendRequestsPage;

