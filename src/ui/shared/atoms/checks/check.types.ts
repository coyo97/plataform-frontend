import { ReactNode } from 'react';

export interface CheckProps {
	checked: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
	variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
	children?: ReactNode;
}

