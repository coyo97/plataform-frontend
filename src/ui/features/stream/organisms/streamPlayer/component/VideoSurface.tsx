// component/VideoSurface.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { radius } from '../../../../../../Theme/tokens/radius';

const StyledVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: radius.sm2x,
  background: '#000',
});

interface Props extends React.VideoHTMLAttributes<HTMLVideoElement> {
  hiddenWhenEmpty?: boolean;
}

const VideoSurface = React.forwardRef<HTMLVideoElement, Props>(
  ({ hiddenWhenEmpty = false, style, ...rest }, ref) => (
    <StyledVideo
      ref={ref}
      style={style}
      {...(hiddenWhenEmpty && {
        onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => {
          const v = e.currentTarget;
          const hasVideo =
            !!v.srcObject && (v.srcObject as MediaStream).getVideoTracks().length > 0;
          v.style.display = hasVideo ? 'block' : 'none';
        },
      })}
      {...rest}
    />
  )
);

export default VideoSurface;

