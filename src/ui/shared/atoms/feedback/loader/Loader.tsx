// src/ui/shared/atoms/feedback/loader/Loader.tsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { LoaderProps } from './Loader.types';
import { LoaderWrapper } from './loader.styles';
// Si prefieres tu átomo de tipografía:
import Text from '../../typography/Text';

const sizeMap = {
	small: 20,
	medium: 40,
	large: 60,
};

const Loader: React.FC<LoaderProps> = ({ size = 'medium', centered = true, message }) => (
	<LoaderWrapper centered={centered}>
		<Box display="flex" flexDirection="column" alignItems="center">
			<CircularProgress size={sizeMap[size]} />
			{message ? (
				// Usa tu átomo Text para mantener consistencia visual
				<Text  sx={{ mt: 1.25, opacity: 0.8 }}>
					{message}
				</Text>
			) : null}
		</Box>
	</LoaderWrapper>
);

export default Loader;

