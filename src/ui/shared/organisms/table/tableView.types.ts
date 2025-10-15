import { ReactNode } from 'react';

export type BreakKey = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type TableSkin = 'default' | 'uatf' | 'accented';
export type ResponsiveMode = 'scroll' | 'card';
export type Align = 'left' | 'center' | 'right';

export type RowKey<T> = keyof T & string | ((row: T, index: number) => string);

export type Accessor<T> = keyof T & string | string;

export interface ColumnDef<T> {
	id: string;
	header: ReactNode;
	accessor?: Accessor<T>;              // p.ej. 'email' o 'publication.title'
	renderCell?: (row: T, index: number) => ReactNode;
	align?: Align;
	minWidth?: number;
	maxWidth?: number;
	truncate?: boolean;
	hiddenAt?: BreakKey[];               // ocultar por breakpoint
	headerTooltip?: ReactNode;           // para InfoTooltip opcional
}

export interface RowAction<T> {
	label: string;
	onClick: (row: T) => void | Promise<void>;
	visible?: (row: T) => boolean;
	disabled?: (row: T) => boolean;
	variant?: 'default' | 'outline' | 'ghost' | 'soft';
	color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'accent';
	icon?: ReactNode;                    // si lo pasas, podemos renderizar IconButton en modo compacto
	confirm?: { title: string; message: string }; // hook para tu Dialog (opcional)
}

export interface PaginationDef {
	page: number;
	totalPages: number;
	pageSize?: number;
	onChangePage: (page: number) => void;
}

export interface TableViewProps<T> {
	data: T[];
	rowKey: RowKey<T>;
	columns: ColumnDef<T>[];
	rowActions?: RowAction<T>[];

	toolbar?: ReactNode;
	footer?: ReactNode;

	loading?: boolean;
	error?: ReactNode | string;
	emptyMessage?: ReactNode | string;

	stickyHeader?: boolean;
	dense?: boolean;
	zebra?: boolean;
	hoverable?: boolean;
	skin?: TableSkin;
	responsiveMode?: ResponsiveMode;     // 'scroll' (default) | 'card'

	// comportamiento de hover especial para filas (e.g. reportes)
	rowHoverTone?: 'default' | 'warning' | 'success' | 'error' | 'accent';

	pagination?: PaginationDef;

	// evento opcional
	onRowClick?: (row: T) => void;
}

