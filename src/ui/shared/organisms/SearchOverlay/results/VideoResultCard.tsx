import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { SearchResult } from '../searchOverlay.types';

const VideoResultCard: React.FC<{ result: SearchResult }> = ({ result }) => {
	return (
		<Card sx={{ display: 'flex', mb: 2, cursor: 'pointer' }}>
			{result.thumbnail && (
				<CardMedia
					component="img"
					sx={{ width: 120 }}
					image={result.thumbnail}
					alt={result.title}
				/>
			)}
			<CardContent>
				<Typography variant="subtitle1">{result.title}</Typography>
				{result.description && (
					<Typography variant="body2" color="text.secondary">
						{result.description}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default VideoResultCard;

