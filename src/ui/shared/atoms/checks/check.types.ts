// shared/atoms/checks/check.types.ts
export type CheckVariant =
	| 'default'
| 'success'
| 'info'
| 'warning'
| 'danger';

export interface CheckProps {
	/** Estado del checkbox (controlado) */
	checked: boolean;
	/** Callback al hacer toggle */
	onChange: (value: boolean) => void;
	/** Deshabilitado visual + funcional */
	disabled?: boolean;
	/** Variante de color */
	variant?: CheckVariant;
	/** Texto opcional para accesibilidad */
	label?: string;
	className?: string;
}

