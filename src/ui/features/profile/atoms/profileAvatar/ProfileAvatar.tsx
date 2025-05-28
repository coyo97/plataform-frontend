// ui/features/profile/atoms/ProfileAvatar/ProfileAvatar.tsx
import React from 'react';
import AvatarX from '../../../../shared/atoms/avatar/AvatarX';

interface Props { src?: string; alt?: string }
const ProfileAvatar: React.FC<Props> = ({ src, alt = 'avatar' }) => (
	<AvatarX size="lg" src={src} alt={alt} />
);
export default ProfileAvatar;

