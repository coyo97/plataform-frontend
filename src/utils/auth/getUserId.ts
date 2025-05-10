/* obtiene el id del usuario autenticado (o string vacío) */
export const getUserId = (): string =>
  localStorage.getItem('userId') ?? '';

