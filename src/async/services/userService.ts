
import { get, post } from '../api'

// Define el tipo de los parámetros que se pasan a las funciones
type Payload = any; // Puedes definir un tipo más específico si conoces la estructura del payload

export const getUser = async (endpoint: string, payload: Payload): Promise<void> => {
	return await get<void>(endpoint, payload);
}

export const createUser = async (endpoint: string, payload: Payload): Promise<void> => {
	return await post<void>(endpoint, payload);
}

