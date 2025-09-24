import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { SearchResult } from '../searchOverlay.types';

const MaterialResultCard: React.FC<{ result: SearchResult }> = ({ result }) => {
	return (
		<Paper
			sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
			variant="outlined"
		>
			<DescriptionIcon sx={{ mr: 2, color: 'primary.main' }} />
			<Box>
				<Typography variant="subtitle1">{result.title}</Typography>
				{result.description && (
					<Typography variant="body2" color="text.secondary">
						{result.description}
					</Typography>
				)}
			</Box>
		</Paper>
	);
};

export default MaterialResultCard;

