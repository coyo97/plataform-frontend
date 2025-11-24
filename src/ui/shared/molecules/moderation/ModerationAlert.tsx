// src/ui/shared/molecules/moderation/ModerationAlert.tsx
import React from 'react';
import { Box, Alert } from '@mui/material';

interface ModerationAlertProps {
	message: string | null;
	onClose?: () => void;
}

const ModerationAlert: React.FC<ModerationAlertProps> = ({ message, onClose }) => {
	if (!message) return null;

	return (
		<Box sx={{ mb: 1 }}>
			<Alert
				severity="warning"
				onClose={onClose}
				sx={{ width: '100%' }}
			>
				{message}
			</Alert>
		</Box>
	);
};

export default ModerationAlert;

