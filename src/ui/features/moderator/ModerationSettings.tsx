// src/ui/components/admin/ModerationSettings.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { Container, StatusText, ToggleButton } from './moderationSettings.styles';
import { Typography } from '@mui/material';

const ModerationSettings: React.FC = () => {
	const [aiModerationEnabled, setAiModerationEnabled] = useState<boolean>(true);
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`${HOST}${SERVICE}/moderation-status`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setAiModerationEnabled(response.data.aiModerationEnabled);
			} catch (error) {
				console.error('Error al obtener el estado del moderador de IA:', error);
			}
		};

		fetchStatus();
	}, [HOST, SERVICE]);

	const toggleModeration = async () => {
		try {
			const token = localStorage.getItem('token');
			const newStatus = !aiModerationEnabled;
			await axios.put(
				`${HOST}${SERVICE}/moderation-status`,
				{ aiModerationEnabled: newStatus },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setAiModerationEnabled(newStatus);
			alert(`Moderador de IA ${newStatus ? 'activado' : 'desactivado'}`);
		} catch (error) {
			console.error('Error al actualizar el estado del moderador de IA:', error);
		}
	};

	return (
		<Container>
			<Typography variant="h5">Configuración del Moderador de imágenes de IA</Typography>
			<StatusText>
				El moderador de IA está actualmente: {aiModerationEnabled ? 'Activado' : 'Desactivado'}
			</StatusText>
			<ToggleButton onClick={toggleModeration}>
				{aiModerationEnabled ? 'Desactivar' : 'Activar'} Moderador de IA
			</ToggleButton>
		</Container>
	);
};

export default ModerationSettings;

