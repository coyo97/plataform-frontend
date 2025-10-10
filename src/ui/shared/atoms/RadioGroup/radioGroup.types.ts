import { ReactNode } from 'react';

export interface RadioOption {
	label: string;
	value: string;
	icon?: ReactNode;
}

export interface RadioGroupProps {
	legend?: string;
	options: RadioOption[];
	value: string;
	onChange: (val: string) => void;
	disabled?: boolean;
	variant?: 'default' | 'segmented';
}

