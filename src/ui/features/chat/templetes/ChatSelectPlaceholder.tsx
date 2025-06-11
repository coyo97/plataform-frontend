import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text     from '../../../shared/atoms/typography/Text';

const ChatSelectPlaceholder: React.FC = () => (
	<SmartBox column center p="px12" style={{ flex:1 }}>
		<Text as="h2" size="lg" weight="medium">Selecciona un chat</Text>
		<Text colorKey="neutral.black.500">
			Elige un contacto o grupo en la barra lateral para empezar a conversar
		</Text>
	</SmartBox>
);

export default ChatSelectPlaceholder;

