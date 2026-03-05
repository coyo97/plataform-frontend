// async/services/permissionService.ts
import { post, get } from '../api';
import getEnvVariables from '../../config/configEnvs';

const { HOST, SERVICE } = getEnvVariables();

interface Permission {
  _id: string;
  name: string;
}

const url = (p: string) => `${HOST}${SERVICE}${p}`;

export interface PermissionPayload {
  moduleId: string;
  actionId: string;
  name: string;
}

export const createPermission = async (payload: PermissionPayload) =>
  post<{ permission: Permission }>(url('/permissions'), payload);

export const fetchPermissions = async (): Promise<Permission[]> => {
  const { permissions } = await get<{ permissions: Permission[] }>(
    url('/permissions'),
    {}
  );
  return permissions;
};


let permissionsCache: string[] | null = null;
let permissionsCacheTime = 0;
// Tiempo que consideramos válido el caché (ej: 5 minutos)
const PERMISSIONS_CACHE_TTL = 5 * 60 * 1000; // 5 min

/** Limpia el caché de permisos (útil en logout) */
export const clearPermissionsCache = () => {
  permissionsCache = null;
  permissionsCacheTime = 0;
};

export const getMyPermissions = async (): Promise<string[]> => {
  const now = Date.now();

  // 1) Si tenemos caché y no está vencido → lo devolvemos
  if (permissionsCache && now - permissionsCacheTime < PERMISSIONS_CACHE_TTL) {
    // console.log('[PERMS] usando caché');
    return permissionsCache;
  }

  // 2) Si no hay caché o está vencido → llamamos al backend
  try {
    const { permissions } = await get<{ permissions: string[] }>(
      url('/me/permissions'),
      {}
    );

    const normalized = permissions ?? [];

    // Guardamos en caché
    permissionsCache = normalized;
    permissionsCacheTime = Date.now();

    // console.log('[PERMS] desde backend', normalized);
    return normalized;
  } catch (error) {
    console.error('Error al obtener permisos del usuario:', error);

    // En caso de error, devolvemos array vacío pero también lo ponemos en caché
    permissionsCache = [];
    permissionsCacheTime = Date.now();

    return [];
  }
};
;
