// shared/atoms/buttons/navButton/NavButton.types.ts
import { ButtonProps } from '@mui/material';

export interface NavButtonProps extends ButtonProps {
	label: string;
	icon?: React.ReactNode;
	active?: boolean;
}

