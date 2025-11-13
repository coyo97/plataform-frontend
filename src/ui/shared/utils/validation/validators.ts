// src/ui/shared/utils/validation/validators.ts
import {
	USERNAME_MIN_LENGTH,
	USERNAME_MAX_LENGTH,
	EMAIL_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
	USERNAME_REGEX,
	EMAIL_REGEX,
	CONTROL_CHARS_REGEX,
	NAME_MIN_LENGTH,
	NAME_MAX_LENGTH,
	NAME_REGEX,
} from './rules';

// Un error de campo es un string o undefined (sin error)
export type FieldError = string | undefined;

export type Validator<T> = (value: T) => FieldError;

export const combineValidators =
	<T>(...validators: Validator<T>[]): Validator<T> =>
	(value: T) => {
		for (const v of validators) {
			const error = v(value);
			if (error) return error;
		}
		return undefined;
	};

export const required =
	(message: string = 'Este campo es obligatorio'): Validator<string> =>
	(value) => {
		if (value == null) return message;
		if (String(value).trim() === '') return message;
		return undefined;
	};

export const minLength =
	(min: number, message?: string): Validator<string> =>
	(value) => {
		if (!value) return undefined; // el required se maneja aparte
		if (value.length < min) {
			return message || `Debe tener al menos ${min} caracteres.`;
		}
		return undefined;
	};

export const maxLength =
	(max: number, message?: string): Validator<string> =>
	(value) => {
		if (!value) return undefined;
		if (value.length > max) {
			return message || `No debe superar los ${max} caracteres.`;
		}
		return undefined;
	};

export const matchesRegex =
	(regex: RegExp, message: string): Validator<string> =>
	(value) => {
		if (!value) return undefined;
		if (!regex.test(value)) return message;
		return undefined;
	};

export const notMatchesRegex =
	(regex: RegExp, message: string): Validator<string> =>
	(value) => {
		if (!value) return undefined;
		if (regex.test(value)) return message;
		return undefined;
	};

export const validateUsername: Validator<string> = combineValidators(
	required('El nombre de usuario es obligatorio.'),
	minLength(
		USERNAME_MIN_LENGTH,
		`El usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres.`
	),
	maxLength(
		USERNAME_MAX_LENGTH,
		`El usuario no debe superar los ${USERNAME_MAX_LENGTH} caracteres.`
	),
	matchesRegex(
		USERNAME_REGEX,
		'Solo se permiten letras, números, punto (.), guion (-) y guion bajo (_).'
	),
	notMatchesRegex(
		CONTROL_CHARS_REGEX,
		'El usuario contiene caracteres no válidos.'
	)
);

export const validateEmail: Validator<string> = combineValidators(
	required('El correo es obligatorio.'),
	maxLength(
		EMAIL_MAX_LENGTH,
		`El correo no debe superar los ${EMAIL_MAX_LENGTH} caracteres.`
	),
	matchesRegex(EMAIL_REGEX, 'Ingresa un correo electrónico válido.'),
	notMatchesRegex(
		CONTROL_CHARS_REGEX,
		'El correo contiene caracteres no válidos.'
	)
);

export const validatePassword: Validator<string> = combineValidators(
	required('La contraseña es obligatoria.'),
	minLength(
		PASSWORD_MIN_LENGTH,
		`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
	),
	maxLength(
		PASSWORD_MAX_LENGTH,
		`La contraseña no debe superar los ${PASSWORD_MAX_LENGTH} caracteres.`
	),
	notMatchesRegex(
		CONTROL_CHARS_REGEX,
		'La contraseña contiene caracteres no válidos.'
	)
	// Aquí podrías añadir validadores opcionales, por ejemplo:
	// matchesRegex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.'),
	// matchesRegex(/[0-9]/, 'Debe contener al menos un número.'),
);

// 4) Confirmación de contraseña
export const validatePasswordConfirm =
	(password: string): Validator<string> =>
	(confirmPassword) => {
		if (!confirmPassword) return 'Confirma tu contraseña.';
		if (password !== confirmPassword) {
			return 'Las contraseñas no coinciden.';
		}
		return undefined;
	};

type ValidatorMap<T> = {
	[K in keyof T]?: Validator<T[K]>;
};

export function validateForm<T extends Record<string, any>>(
	values: T,
	validators: ValidatorMap<T>
): { errors: { [K in keyof T]?: string }; isValid: boolean } {
	const errors: { [K in keyof T]?: string } = {};

	(Object.keys(validators) as (keyof T)[]).forEach((key) => {
		const validator = validators[key];
		if (!validator) return;
		const value = values[key];
		const error = validator(value);
		if (error) {
			errors[key] = error;
		}
	});

	const isValid = Object.values(errors).every((e) => !e);
	return { errors, isValid };
}

// ===== Validadores específicos para nombres ===== //

export const createNameValidator = (label: string): Validator<string> =>
	combineValidators(
		required(`${label} es obligatorio.`),
		minLength(
			NAME_MIN_LENGTH,
			`${label} debe tener al menos ${NAME_MIN_LENGTH} caracteres.`
		),
		maxLength(
			NAME_MAX_LENGTH,
			`${label} no debe superar los ${NAME_MAX_LENGTH} caracteres.`
		),
		matchesRegex(
			NAME_REGEX,
			`${label} solo puede contener letras y espacios.`
		),
		notMatchesRegex(
			CONTROL_CHARS_REGEX,
			`${label} contiene caracteres no válidos.`
		)
	);

// Para campos opcionales parecidos a nombre/colegio
export const createOptionalNameLikeValidator =
	(label: string, max: number = 100): Validator<string> =>
	(value) => {
		// ⬇⬇⬇ CAMBIO CLAVE: devolver undefined, no null
		if (!value || !value.trim()) return undefined; // opcional

		if (value.length < 2) {
			return `${label} debe tener al menos 2 caracteres.`;
		}
		if (value.length > max) {
			return `${label} no debe superar los ${max} caracteres.`;
		}
		if (CONTROL_CHARS_REGEX.test(value)) {
			return `${label} contiene caracteres no válidos.`;
		}
		return undefined;
	};
;
