import { ReactNode } from 'react';
export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps {
	children: ReactNode;
	type?: AlertType;
	variant?: 'standard' | 'outlined' | 'filled';
	onClose?: () => void;
}

