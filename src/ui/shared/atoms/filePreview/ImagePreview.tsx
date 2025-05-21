// shared/atoms/filePreview/ImagePreview.tsx
import React from 'react';
import { Box } from '@mui/material';
import { radius } from '../../../../Theme/tokens/radius';

interface Props {
	src : string;
	alt?: string;
}

const ImagePreview: React.FC<Props> = ({ src, alt }) => (
	<Box
		component="img"
		src={src}
		alt={alt}
		sx={{
			width: '100%',
			maxWidth: 500,
			borderRadius: radius.md,
		}}
	/>
);

export default ImagePreview;

