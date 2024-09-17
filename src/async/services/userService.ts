
import { get, post } from '../api'

// Define el tipo de los parámetros que se pasan a las funciones
type Payload = any; // Puedes definir un tipo más específico si conoces la estructura del payload

export const getUser = async (endpoint: string, payload: Payload): Promise<void> => {
	return await get<void>(endpoint, payload);
}

export const createUser = async (endpoint: string, payload: Payload): Promise<void> => {
	return await post<void>(endpoint, payload);
}

// Define el tipo de respuesta para el inicio de sesión
interface LoginResponse {
  token: string;
  userId: string;
}

// Define el tipo de payload para el inicio de sesión
interface LoginPayload {
  email: string;
  password: string;
}

// Función para iniciar sesión
export const loginUser = async (endpoint: string, payload: LoginPayload): Promise<LoginResponse> => {
  return await post<LoginResponse>(endpoint, payload);
};

