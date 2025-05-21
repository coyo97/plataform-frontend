// shared/atoms/avatar/AvatarX.tsx
import React from 'react';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';
import { radius } from '../../../../Theme/tokens/radius';

interface Props extends AvatarProps {
	size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 32, md: 40, lg: 48 };

const AvatarX: React.FC<Props> = ({ size='md', sx={}, ...rest }) => (
	<MuiAvatar
		sx={{
			width : sizeMap[size],
			height: sizeMap[size],
			borderRadius: radius.infinity,
			...sx,
		}}
		{...rest}
	/>
);

export default AvatarX;

