// src/ui/shared/organisms/SearchOverlay/results/PersonResultCard.tsx
import React, { useState } from 'react';
import { Avatar, Box, Typography, Button } from '@mui/material';
import { sendFriendRequest } from '../../../../../async/services/friendService';
import { SearchResult } from '../searchOverlay.types';
import AvatarX from '../../../atoms/avatar/AvatarX';
import { User } from '../../../../../types/types';

const PersonResultCard: React.FC<{ result: SearchResult, author?: User, HOST: string, onAuthor   : (id: string, user: string) => void,
}> = ({ result, author, HOST, onAuthor }) => {
	const [status, setStatus] = useState<'none' | 'sent'>('none');

	const handleSendRequest = async () => {
		try {
			await sendFriendRequest(result.id);
			setStatus('sent');
		} catch (err) {
			console.error('Error al enviar solicitud:', err);
		}
	};

	const hasAuthor = Boolean(author?.username);

	const avatarSrc = author?.profile?.profilePicture
		? `${HOST}/${author.profile.profilePicture}`
		: undefined;
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					mb: 2,
					justifyContent: 'space-between',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<AvatarX
						src={avatarSrc}
						alt={author?.username ?? 'autor'}
						size="md"
						onClick={() => hasAuthor && author && onAuthor(author._id, author.username)}
						sx={{ cursor: hasAuthor ? 'pointer' : 'default' }}
					/>
					<Box>
						<Typography variant="subtitle1">{result.title}</Typography>
						{result.description && (
							<Typography variant="body2" color="text.secondary">
								{result.description}
							</Typography>
						)}
					</Box>
				</Box>

				{status === 'none' ? (
					<Button variant="outlined" size="small" onClick={handleSendRequest}>
						Enviar solicitud
					</Button>
				) : (
					<Typography variant="body2" color="primary">
						Solicitud enviada
					</Typography>
				)}
			</Box>
		);
};

export default PersonResultCard;

