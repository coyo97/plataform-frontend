import { breakPoints } from '../../../../config/mq';

export type GridVariant =
	| 'mobile'
| 'tablet'
| 'desktopFixed'
| 'desktopFluid'
| 'vertical';

// Usa los mismos labels que tienes en breakPoints.values
export type BreakpointLabel = keyof typeof breakPoints.values;

export interface GridContainerProps
extends React.HTMLAttributes<HTMLDivElement> {
	variant?: GridVariant;
	children: React.ReactNode;
	className?: string;
	// número de columnas por breakpoint (opcional)
	columns?: Partial<Record<BreakpointLabel, number>>;
}

export interface GridColumnProps
extends React.HTMLAttributes<HTMLDivElement> {
	// puede ser un número único o un mapa de breakpoints
	span?: number | Partial<Record<BreakpointLabel, number>>;
	children: React.ReactNode;
	className?: string;
	as?: keyof JSX.IntrinsicElements;
	self?: 'start' | 'center' | 'end' | 'stretch'
       | Partial<Record<BreakpointLabel, 'start' | 'center' | 'end' | 'stretch'>>;
}

