// src/ui/shared/messages/permissionMessages.ts
export type PermissionMessageKey =
	| 'createDenied'
| 'updateDenied'
| 'deleteDenied'
| 'reportDenied'
| 'genericDenied';

export const getPermissionMessage = (key: PermissionMessageKey): string => {
	switch (key) {
		case 'createDenied':
			return 'No tienes permisos para crear este tipo de contenido. Si lo necesitas, solicita acceso al administrador de tu carrera o facultad.';
		case 'updateDenied':
			return 'No tienes permisos para editar este contenido. Puedes solicitar permisos adicionales al administrador.';
		case 'deleteDenied':
			return 'No tienes permisos para eliminar este contenido. Consulta con el administrador si crees que esto es un error.';
		case 'reportDenied':
			return 'No tienes permisos para realizar esta acción. Intenta con otra operación o contacta al administrador.';
		case 'genericDenied':
			default:
			return 'No tienes permisos para realizar esta acción en el sistema.';
	}
};

