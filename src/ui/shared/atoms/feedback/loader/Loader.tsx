import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LoaderProps } from './Loader.types';
import { LoaderWrapper } from './loader.styles';

const sizeMap = {
	small: 20,
	medium: 40,
	large: 60,
};

const Loader: React.FC<LoaderProps> = ({ size = 'medium', centered = true}) => (//false
	<LoaderWrapper centered={centered}>
		<CircularProgress size={sizeMap[size]} />
	</LoaderWrapper>
);

export default Loader;

