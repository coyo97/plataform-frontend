/* ui/features/publications/templates/PublicationsLayout.tsx */
import { Box } from '@mui/material';
import React from 'react';

const PublicationsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      height: t => `calc(100vh - ${t.mixins.toolbar.minHeight}px)`,
      overflowX: 'hidden',

      // ✅ Use grid from small screens upward
      display: { xs: 'block', sm: 'grid' },

      // ✅ Responsive columns
      gridTemplateColumns: {
        xs: '1fr',                 // mobile → only feed
        sm: '200px 1fr',           // small → left sidebar + feed
        md: '200px 1fr 200px',     // medium → both sidebars but narrower
        lg: '260px 1fr 260px',     // large → full layout
      },

      // Gap between columns
      gap: 3,

      // Horizontal padding
      px: 2,

      // Space below toolbar
	  paddingTop: 11
    }}
  >
    {children}
  </Box>
);

export default PublicationsLayout;

