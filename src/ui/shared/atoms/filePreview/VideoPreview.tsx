// shared/atoms/filePreview/VideoPreview.tsx
import React from 'react';
import { Box } from '@mui/material';
import { radius } from '../../../../Theme/tokens/radius';

interface Props {
	src : string;
	type: string;
}

const VideoPreview: React.FC<Props> = ({ src, type }) => (
	<Box
		component="video"
		controls
		sx={{
			width: '100%',
			maxWidth: 500,
			borderRadius: radius.md,
		}}
	>
		<source src={src} type={type} />
	</Box>
);

export default VideoPreview;
