import { ReactNode } from 'react';

export interface InfoTooltipProps {
	content: string | ReactNode;
	position?: 'top' | 'bottom' | 'left' | 'right';
	size?: 'small' | 'medium' | 'large';
	className?: string;
	icon?: ReactNode;
	delay?: number;
}

