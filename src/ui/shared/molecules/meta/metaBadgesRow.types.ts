export type MetaBadgeVariant = 'filled' | 'outline' | 'soft';
export type MetaBadgeColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

export interface MetaBadgeItem {
	label: string;
	color?: MetaBadgeColor;
	variant?: MetaBadgeVariant;
}

export interface MetaBadgesRowProps {
	items: MetaBadgeItem[];
	className?: string;
}

