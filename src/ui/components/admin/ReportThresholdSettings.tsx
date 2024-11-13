import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { Container, Title, Label, Input, Button } from './reportThresholdSettingsStyles';

const ReportThresholdSettings: React.FC = () => {
	const [reportThreshold, setReportThreshold] = useState<number>(5);
	const [notificationThreshold, setNotificationThreshold] = useState<number>(3);
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`${HOST}${SERVICE}/settings`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setReportThreshold(response.data.settings.reportThreshold);
				setNotificationThreshold(response.data.settings.notificationThreshold);
			} catch (error) {
				console.error('Error al obtener los umbrales de reporte:', error);
			}
		};

		fetchSettings();
	}, [HOST, SERVICE]);

	const updateThresholds = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.put(
				`${HOST}${SERVICE}/settings`,
				{ reportThreshold, notificationThreshold },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Umbrales actualizados correctamente');
		} catch (error) {
			console.error('Error al actualizar los umbrales de reporte:', error);
		}
	};

	return (
		<Container>
			<Title>Configuración de Umbrales de Reporte</Title>
			<div>
				<Label>
					Umbral para bloquear usuarios:
					<Input
						type="number"
						value={reportThreshold}
						onChange={(e) => setReportThreshold(Number(e.target.value))}
					/>
				</Label>
			</div>
			<div>
				<Label>
					Umbral para notificaciones:
					<Input
						type="number"
						value={notificationThreshold}
						onChange={(e) => setNotificationThreshold(Number(e.target.value))}
					/>
				</Label>
			</div>
			<Button onClick={updateThresholds}>Guardar Cambios</Button>
		</Container>
	);
};

export default ReportThresholdSettings;

