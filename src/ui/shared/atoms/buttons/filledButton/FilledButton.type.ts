import { ButtonProps } from '@mui/material';
import { ButtonColorType, ButtonShape, ButtonVariant } from '../button.types';//heredamos loc comunes

export interface FilledButtonProps extends ButtonProps {
	colorType?: ButtonColorType;
	btnVariant?: ButtonVariant;
	shape?: ButtonShape;
}

