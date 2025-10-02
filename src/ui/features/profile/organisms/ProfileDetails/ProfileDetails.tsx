// ui/features/profile/organisms/ProfileDetails/ProfileDetails.tsx
import React, { useState } from 'react';
import getEnvVariables from '../../../../../config/configEnvs';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import SectionTitle from '../../../../shared/atoms/titles/SectionTitle';
import ProfileAvatar from '../../atoms/profileAvatar/ProfileAvatar';
import ProfileInfo from '../../moleculas/ProfileInfo/ProfileInfo';
import type { UserProfile } from '../../../../../types/profile';

import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props { profile: UserProfile }

const ProfileDetails: React.FC<Props> = ({ profile }) => {
	const { HOST } = getEnvVariables();
	const src = profile.profilePicture ? `${HOST}/${profile.profilePicture}` : undefined;

	const [open, setOpen] = useState(false);

	return (
		<SmartBox column gap="px10" center radius="md2x" shadow="md" p="px12">
			<SectionTitle>Perfil</SectionTitle>

			<div onClick={() => src && setOpen(true)} style={{ cursor: src ? 'pointer' : 'default' }}>
				<ProfileAvatar src={src} />
			</div>

			<ProfileInfo data={profile} />

			<Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
				<IconButton
					aria-label="close"
					onClick={() => setOpen(false)}
					sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent sx={{ p: 0, background: 'black' }}>
					{src && (
						<img
							src={src}
							alt="Foto de perfil"
							style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
						/>
					)}
				</DialogContent>
			</Dialog>
		</SmartBox>
	);
};

export default ProfileDetails;

