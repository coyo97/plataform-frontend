// src/ui/shared/organisms/formLayout/formLayout.types.ts
import { ReactNode, FormEvent } from 'react';
import type { BreakpointLabel } from '../../atoms/grid/grid.types';

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'custom';

export interface FormFieldBase {
	/** id del campo, clave en el objeto values */
	id: string;
	label?: string;
	type?: FormFieldType; // default: 'text'
	placeholder?: string;
	helperText?: string;
	required?: boolean;
	/** span de columnas en el grid */
	span?: number | Partial<Record<BreakpointLabel, number>>;
	/** tamaño del TextField */
	size?: 'small' | 'medium' | 'large';
}

/** Campo tipo select simple */
export interface SelectOption {
	label: string;
	value: string;
}

export interface SelectFieldConfig extends FormFieldBase {
	type: 'select';
	options: SelectOption[];
}

/** Campo custom (para cosas especiales como CareerSelector) */
export interface CustomFieldConfig extends FormFieldBase {
	type: 'custom';
	render: (
		field: CustomFieldConfig,
		value: any,
		onChange: (value: any) => void
	) => ReactNode;
}

export type FormFieldConfig =
	| FormFieldBase    // text / email / password / number
| SelectFieldConfig
| CustomFieldConfig;

export interface FormLayoutProps {
	/** Título del formulario (ej. "Iniciar sesión", "Registro") */
	title?: ReactNode;
	/** Texto descriptivo opcional bajo el título */
	description?: ReactNode;

	/** Configuración de campos */
	fields: FormFieldConfig[];
	/** Valores controlados por el padre: { [id]: value } */
	values: Record<string, any>;
	/** Se llama cuando cambia un campo */
	onChange: (fieldId: string, value: any) => void;

	/** Submit del formulario */
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;

	/** Mensajes globales */
	errorMessage?: string;
	successMessage?: string;

	/** Botón principal (submit) */
	primaryLabel: string;
	primaryDisabled?: boolean;

	/** Botón secundario (ej. "Olvidaste tu contraseña", "Ir a login") */
	secondaryLabel?: string;
	onSecondaryClick?: () => void;

	/** Layout de columnas del grid (por defecto: { xxs: 4, sm: 8, md: 12 }) */
	columns?: Partial<Record<BreakpointLabel, number>>;

	/** Ancho máximo del formulario (px) */
	maxWidth?: number;

	/** Mostrar loader opcional en el área de acciones */
	loading?: boolean;
}

