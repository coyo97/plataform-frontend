import { get, post } from '../api';
import { put, del } from '../api'; // Importar los métodos PUT y DELETE

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


// Función para actualizar una publicación

export const updatePublication = async (endpoint: string, formData: FormData): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(endpoint, {
        method: 'PUT',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error updating publication: ${response.status}`);
    }
};


// Función para eliminar una publicación
export const deletePublication = async (endpoint: string): Promise<void> => {
    try {
        await del(endpoint);
    } catch (error) {
        console.error('Error deleting publication:', error);
        throw new Error(`Error deleting publication: ${error}`);
    }
};
