import { ButtonProps } from '@mui/material';
import { ButtonColorType, ButtonShape, ButtonVariant } from '../button.types';//heredamos loc comunes


/**
 * Polymorphic — hereda todos los props de Button y, si
 * `component="a"`, también los de <a>.  MUI ya se encarga
 * de esa unión gracias al genérico `ButtonProps<C>`.
 */
export type FilledButtonProps<
C extends React.ElementType = 'button'
> = ButtonProps<C, { component?: C }> & {
	colorType?: ButtonColorType;
	btnVariant?: ButtonVariant;
	shape?: ButtonShape;
};
