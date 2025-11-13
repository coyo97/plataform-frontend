// src/ui/features/access-policies/constants.ts
import type { Op } from '../../../async/services/accessPolicyService';


export const SUBJECT_PATHS = [
	{ value: 'actor.careerIds', label: 'Actor • Carreras' },
	{ value: 'actor.facultyIds', label: 'Actor • Facultades' },
	{ value: 'actor.roleIds', label: 'Actor • Roles' },
];


export const TARGET_PATHS = [
	{ value: 'target.careerIds', label: 'Target • Carreras' },
	{ value: 'target.facultyIds', label: 'Target • Facultades' },
];


export const RESOURCE_PATHS = [
	{ value: 'resource.ownerId', label: 'Recurso • Dueño' },
];


export const OPERATORS: { value: Op; label: string; hint: string }[] = [
	{ value: 'eq', label: 'es igual a', hint: 'Compara un solo valor.' },
	{ value: 'neq', label: 'es distinto de', hint: 'Compara un solo valor.' },
	{ value: 'in', label: 'está en la lista', hint: 'Coincide con cualquiera de la lista.' },
	{ value: 'not_in', label: 'no está en la lista', hint: 'No coincide con ninguno de la lista.' },
	{ value: 'overlaps', label: 'tiene intersección con', hint: 'Comparte al menos un elemento con la lista.' },
];
