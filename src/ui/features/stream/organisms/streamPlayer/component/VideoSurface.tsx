// components/VideoSurface.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { radius } from '../../../../../../Theme/tokens/radius';

const StyledVideo = styled('video')({
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	borderRadius: radius.sm2x,
});

interface Props
extends React.VideoHTMLAttributes<HTMLVideoElement> {
	hiddenWhenEmpty?: boolean;
}

const VideoSurface = React.forwardRef<HTMLVideoElement, Props>(
	({ hiddenWhenEmpty = false, style, ...rest }, ref) => (
		<StyledVideo
			ref={ref}
			style={style}
			{...(hiddenWhenEmpty && {
				onLoadedMetadata: (e) => {
					const v = e.currentTarget;
					v.style.display =
						v.srcObject && (v.srcObject as MediaStream).getVideoTracks().length
							? 'block'
							: 'none';
				},
			})}
			{...rest}
		/>
	)
);

export default VideoSurface;

