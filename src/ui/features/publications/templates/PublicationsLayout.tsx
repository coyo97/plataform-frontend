/* ui/features/publications/templates/PublicationsLayout.tsx */
import { Box } from '@mui/material';
import React   from 'react';

const PublicationsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Box
		sx={{
			height: t => `calc(100vh - ${t.mixins.toolbar.minHeight}px)`,
			overflowX: 'hidden',            // ← el propio layout no hace scroll
			display: { xs:'block', md:'block', lg:'grid' },
		gridTemplateColumns: '260px 1fr 260px',
		gap: 3,
		px: 2,
		}}
	>
		{children}
	</Box>
);

export default PublicationsLayout;

