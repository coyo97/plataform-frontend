import { get, post } from '../api';

type Payload = any;

// Función para obtener las publicaciones
export const getPublications = async (endpoint: string, payload: Payload): Promise<{ publications: any[] }> => {
    return await get<{ publications: any[] }>(endpoint, payload);
};

// Función para crear una nueva publicación
export const createPublication = async (endpoint: string, payload: Payload): Promise<void> => {
    return await post<void>(endpoint, payload);
};
// Función para obtener las publicaciones del usuario autenticado
export const getUserPublications = async (endpoint: string): Promise<{ publications: any[] }> => {
    return await get<{ publications: any[] }>(endpoint, {});
};

