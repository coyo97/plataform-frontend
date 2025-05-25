// src/async/services/careerService.ts
import { get } from '../api';
import getEnvVariables from '../../config/configEnvs';
import * as R from '../routes/careerRoutes'; // crea esto si no existe
import type { Career } from '../../types/publication'; // o types/career.ts si lo separas

const { HOST, SERVICE } = getEnvVariables();
const url = (path: string) => `${HOST}${SERVICE}${path}`;

export const list = async (): Promise<Career[]> => {
	const { careers } = await get<{ careers: Career[] }>(url(R.CAREERS), {});
	return careers;
};

