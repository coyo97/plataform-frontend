/* ui/features/publications/templates/PublicationsLayout.tsx */
import { Box } from '@mui/material';
import React   from 'react';

const PublicationsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Box
		sx={{
			height     : t => `calc(100vh - ${t.mixins.toolbar.minHeight}px)`,
			overflowX  : 'hidden',

			/* ① – GRID a partir de 600 px (sm) */
			display: { xs:'block', sm:'grid' },

		/* ② – Tres columnas cuando hay grid */
		gridTemplateColumns: {
			xs : '1fr',                // móvil: solo la columna central
			sm : '260px 1fr 260px',    // ≥ 600 px: sidebars + feed
		},

		gap: 3,
		px : 2,
		paddingTop: 5,
		}}
	>
		{children}
	</Box>
);

export default PublicationsLayout;

