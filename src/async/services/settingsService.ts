import { get, put } from '../api';
import getEnvVariables from '../../config/configEnvs';

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

interface Thresholds {
	reportThreshold: number;
	notificationThreshold: number;
}

export const fetchThresholdSettings = async (): Promise<Thresholds> => {
	const { settings } = await get<{ settings: Thresholds }>(url('/settings'));
	return settings;
};

export const updateThresholdSettings = async (thresholds: Thresholds): Promise<void> => {
	await put<void>(url('/settings'), thresholds);
};

