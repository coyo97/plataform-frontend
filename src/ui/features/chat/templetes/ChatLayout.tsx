import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';

const ChatLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
	<SmartBox row sx={{ height: '100%', minHeight: 480, background: '#fff' }}>
		{children}
	</SmartBox>
);

export default ChatLayout;

