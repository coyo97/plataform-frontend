export type GridVariant = 'mobile' | 'tablet' | 'desktopFixed' | 'desktopFluid' | 'vertical';  

export interface GridContainerProps {
	variant?: GridVariant;
	children: React.ReactNode;
	className?: string;
}

export interface GridColumnProps {
	span?: number; // Cuántas columnas ocupa
	children: React.ReactNode;
	className?: string;
}

