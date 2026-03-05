import type { Op } from '../../../async/services/accessPolicyService';

/**
 * SUBJECT (Actor)
 * Usuario que realiza la acción.
 * Ejemplos:
 * - Estudiante que intenta ver una publicación.
 * - Usuario que envía un mensaje de chat.
 * - Usuario que manda una solicitud de amistad.
 */
export const SUBJECT_PATHS = [
  {
    value: 'actor.careerIds',
    label: 'Usuario que realiza la acción • Carreras', // Ej: carrera del estudiante que intenta ver una publicación
  },
  {
    value: 'actor.facultyIds',
    label: 'Usuario que realiza la acción • Facultades', // Ej: facultad del estudiante que envía una solicitud de amistad
  },
  {
    value: 'actor.roleIds',
    label: 'Usuario que realiza la acción • Roles', // Ej: rol "Admin", "Docente", "Estudiante"
  },
];

/**
 * TARGET (Usuario afectado)
 * Usuario sobre el cual se ejecuta la acción.
 * Ejemplos:
 * - Dueño del perfil que se está viendo.
 * - Dueño de la publicación que se está leyendo.
 * - Usuario que recibe un mensaje o una solicitud de amistad.
 */
export const TARGET_PATHS = [
  {
    value: 'target.careerIds',
    label: 'Usuario afectado • Carreras', // Ej: carrera del dueño del perfil o de la publicación
  },
  {
    value: 'target.facultyIds',
    label: 'Usuario afectado • Facultades', // Ej: facultad del dueño del perfil o de la publicación
  },
];

/**
 * RESOURCE (Recurso)
 * Objeto sobre el que se actúa.
 * Ejemplos:
 * - Publicación, comentario, perfil, grupo, stream.
 */
export const RESOURCE_PATHS = [
  {
    value: 'resource.ownerId',
    label: 'Recurso • Dueño', // Ej: usuario dueño de la publicación, perfil, grupo o stream
  },
];

/**
 * OPERADORES
 * Explicados con ejemplos usando tus módulos:
 * publicaciones, perfiles, chat, comentarios, solicitudes de amistad.
 */
export const OPERATORS: { value: Op; label: string; hint: string }[] = [
  {
    value: 'eq',
    label: 'es exactamente',
    hint:
      'Úsalo cuando algo debe ser de una sola persona. Ej: permitir que un estudiante edite SOLO su propia publicación o SOLO su propio perfil (el dueño del recurso es exactamente el usuario que realiza la acción).',
  },
  {
    value: 'neq',
    label: 'es diferente de',
    hint:
      'Úsalo para excluir un valor específico. Ej: bloquear que cierto rol específico (por ejemplo "Invitado") pueda comentar publicaciones, marcando que el rol es diferente de "Estudiante" o "Docente".',
  },
  {
    value: 'in',
    label: 'tiene alguna de estas',
    hint:
      'Úsalo con listas. Se cumple si el usuario pertenece a al menos una opción. Ej: permitir ver publicaciones solo a estudiantes de [Sistemas, Informática], o permitir acceder al chat solo a carreras dentro de una lista determinada.',
  },
  {
    value: 'not_in',
    label: 'no tiene ninguna de estas',
    hint:
      'Úsalo para bloquear grupos completos. Ej: impedir que estudiantes de [Medicina, Derecho] envíen solicitudes de amistad, o que ciertas carreras vean publicaciones de un módulo específico.',
  },
  {
    value: 'overlaps',
    label: 'comparte al menos una',
    hint:
      'Úsalo cuando quieras que actor y usuario afectado compartan algo en común de una lista. Ej: permitir chat o ver perfiles solo entre estudiantes que compartan al menos una carrera de las seleccionadas (comparten al menos una carrera en la lista).',
  },
];

