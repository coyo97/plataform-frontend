import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import MainInput from '../../shared/atoms/inputs/MainInput';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import { fetchThresholdSettings, updateThresholdSettings } from '../../../async/services/settingsService';

const ReportThresholdSettings: React.FC = () => {
	const [reportThreshold, setReportThreshold] = useState<number>(5);
	const [notificationThreshold, setNotificationThreshold] = useState<number>(3);
	const { HOST, SERVICE } = getEnvVariables();

useEffect(() => {
	const load = async () => {
		try {
			const settings = await fetchThresholdSettings();
			setReportThreshold(settings.reportThreshold);
			setNotificationThreshold(settings.notificationThreshold);
		} catch (err) {
			console.error('Error al obtener configuración:', err);
		}
	};
	load();
}, []);

const updateThresholds = async () => {
	try {
		await updateThresholdSettings({ reportThreshold, notificationThreshold });
		alert('Umbrales actualizados correctamente');
	} catch (err) {
		console.error('Error al actualizar configuración:', err);
	}
};


	return (
		<SmartBox
			column
			gap={3}
			sx={{
				width: '100%',
				maxWidth: 500,
				mx: 'auto',
				p: { xs: 2, sm: 3 },
				boxShadow: 2,
				borderRadius: 2,
				bgcolor: 'background.paper',
			}}
		>
			<Text size="xl" weight="bold">Configuración de Umbrales de Reporte</Text>

			<SmartBox column gap={2}>
				<Text size="md" weight="medium">Umbral para bloquear usuarios:</Text>
				<MainInput
					label='Number'
					type="number"
					value={reportThreshold.toString()}
					onChange={(val) => setReportThreshold(Number(val))}
					placeholder="Ej: 5"
				/>
			</SmartBox>

			<SmartBox column gap={2}>
				<Text size="md" weight="medium">Umbral para notificaciones:</Text>
				<MainInput
					label='Number'
					type="number"
					value={notificationThreshold.toString()}
					onChange={(val) => setNotificationThreshold(Number(val))}
					placeholder="Ej: 3"
				/>
			</SmartBox>

			<FilledButton onClick={updateThresholds}>
				Guardar Cambios
			</FilledButton>
		</SmartBox>
	);
};

export default ReportThresholdSettings;

