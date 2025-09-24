import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SearchResult } from '../searchOverlay.types';

const PostResultCard: React.FC<{ result: SearchResult }> = ({ result }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/publications?search=${encodeURIComponent(result.title)}`);
	};

	return (
		<Paper
			sx={{ p: 2, mb: 2, cursor: 'pointer' }}
			variant="outlined"
			onClick={handleClick}
		>
			<Typography variant="subtitle1" sx={{ mb: 1 }}>
				{result.title}
			</Typography>
			{result.description && (
				<Typography variant="body2" color="text.secondary">
					{result.description}
				</Typography>
			)}
		</Paper>
	);
};

export default PostResultCard;

