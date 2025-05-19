import { ButtonProps } from '@mui/material';
import { ButtonColorType } from '../button.types';//

export interface GhostButtonProps extends ButtonProps {
	label: string;
	colorType?: ButtonColorType;
}

