export type GridVariant = 'mobile' | 'tablet' | 'desktopFixed' | 'desktopFluid' | 'vertical';  

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: GridVariant;
	children: React.ReactNode;
	className?: string;
	columns?: Partial<Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', number>>;
}

export interface GridColumnProps {
	span?: number; // Cuántas columnas ocupa
	children: React.ReactNode;
	className?: string;
	as?: keyof JSX.IntrinsicElements;
}

