// src/ui/components/platform/sections/DashboardCard.tsx
import React from 'react';
import { Paper } from '@mui/material';

const DashboardCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Paper
		elevation={0}
		sx={{
			p: 2,
			borderRadius: 3,
			border: theme => `1px solid ${theme.palette.divider}`,
		}}
	>
		{children}
	</Paper>
);

export default DashboardCard;

