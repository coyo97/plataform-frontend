// ui/features/academicHelp/layout/HelpLayout.tsx
import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';

const HelpLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<SmartBox
		sx={{
			height: t => `calc(100vh - ${t.mixins.toolbar.minHeight}px)`,
			display: { xs: 'block', sm: 'grid' },
		/* 260 – contenido – 260 */
		gridTemplateColumns: {
			xs: '1fr',
			sm: '260px 1fr 260px',
		},
		gap: 3,
		px: 2,
		pt: 3,
		overflowX: 'hidden',
		}}
	>
		{children}
	</SmartBox>
);
export default HelpLayout;

