import { ButtonProps } from '@mui/material';
import { theme } from '../../../../../Theme/Theme';

type ButtonPaletteKey = keyof typeof theme.palette.button;

export interface GhostButtonProps extends ButtonProps {
	label: string;
	colorType?: ButtonPaletteKey;
}

