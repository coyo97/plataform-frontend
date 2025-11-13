import { ButtonProps } from '@mui/material';
import { ButtonColorType, ButtonShape, ButtonVariant } from '../button.types';//heredamos loc comunes



export type FilledButtonProps<
C extends React.ElementType = 'button'
> = ButtonProps<C, { component?: C }> & {
	colorType?: ButtonColorType;
	btnVariant?: ButtonVariant;
	shape?: ButtonShape;
};
