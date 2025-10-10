// src/ui/shared/atoms/badges/badge.types.ts
import { ReactNode, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'filled' | 'outline' | 'soft';
	color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
	shape?: 'default' | 'rounded';
	size?: 'sm' | 'md';
	icon?: ReactNode;
	image?: string;
	children: ReactNode;

	interactive?: boolean;

	ariaLabel?: string;
}

