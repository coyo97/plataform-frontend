import { ReactNode } from 'react';

export type Align = 'left' | 'center' | 'right';
export type ButtonColor =
	| 'primary'
| 'secondary'
| 'success'
| 'error'
| 'warning'
| 'info'
| 'accent';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'soft';

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ResponsiveMode = 'auto' | 'scroll' | 'card';

export interface ColumnDef<T> {
	id: string;
	header: ReactNode;
	accessor?: keyof T;
	minWidth?: number;
	align?: Align;
	truncate?: boolean;
	hiddenAt?: BreakpointKey[]; // ej. ['xs', 'sm']
	renderCell?: (row: T) => ReactNode;
	sticky?: 'left' | 'right';
}

export interface RowAction<T> {
	label: string;
	color?: ButtonColor;
	variant?: ButtonVariant;
	visible?: (row: T) => boolean;
	onClick: (row: T) => void;
}

export interface PaginationConfig {
	page: number;
	totalPages: number;
	onChangePage: (page: number) => void;
}

export interface TableViewProps<T> {
	data: T[];
	rowKey: keyof T;
	columns: ColumnDef<T>[];
	rowActions?: RowAction<T>[];
	loading?: boolean;
	emptyMessage?: string;
	zebra?: boolean;
	stickyHeader?: boolean;
	hoverable?: boolean;
	dense?: boolean;
	skin?: 'default' | 'surface';
	responsiveMode?: ResponsiveMode; // 'auto' por defecto
	toolbar?: ReactNode | null;
	pagination?: PaginationConfig;
	actionsAsMenu?: boolean;
}

