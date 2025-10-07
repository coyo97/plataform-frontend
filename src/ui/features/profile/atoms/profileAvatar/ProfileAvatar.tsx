// ui/features/profile/atoms/ProfileAvatar/ProfileAvatar.tsx
import React from 'react';
import AvatarX from '../../../../shared/atoms/avatar/AvatarX';
import type { SxProps, Theme } from '@mui/material/styles';

interface Props {
	src?: string;
	alt?: string;
	sx?: SxProps<Theme>; // <- añadimos soporte para sx
}

const ProfileAvatar: React.FC<Props> = ({ src, alt = 'avatar', sx }) => (
	<AvatarX size="lg" src={src} alt={alt} sx={sx} />
);

export default ProfileAvatar;

