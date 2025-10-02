import { post } from '../../async/api';
import getEnvVariables from '../../config/configEnvs';
import { LoginResponse } from '../../types/auth';

const { HOST, SERVICE } = getEnvVariables();
const BASE_URL = `${HOST}${SERVICE}/users`;

/* ---------- Registro de usuario ---------- */
export const registerUser = async (userData: {
	username: string;
	email: string;
	password: string;
	careers: string[];
	apellidoPaterno: string;
	apellidoMaterno: string;
}) => {
	const res = await post(`${BASE_URL}`, userData);
	return res;
};

export const login = async (credentials: {
	email: string;
	password: string;
}): Promise<LoginResponse> => {
	const res = await post<LoginResponse>(`${BASE_URL}/login`, credentials);
	return res;
};

export const forgotPassword = (email: string) =>
	post(`${BASE_URL}/users/forgot-password`, { email });

export const resetPassword = (token: string, password: string) =>
	post(`${BASE_URL}/users/reset-password/${token}`, { password });
