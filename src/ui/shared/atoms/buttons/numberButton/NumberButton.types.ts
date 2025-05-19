export type NumberButtonVariant = 'filled' | 'outlined' | 'ghost';
import { ButtonProps } from '@mui/material';
export type NumberButtonSize = 'sm' | 'md' | 'lg'; // 👈 nuevo

export interface NumberButtonProps extends ButtonProps {
	value: number;
	btnVariant?: NumberButtonVariant;
	btnSize?: NumberButtonSize; // 👈 nuevo
	selected?: boolean;
}

