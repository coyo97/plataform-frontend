import React from 'react';
import { GridColumnProps } from './grid.types';
import { getColumnWidth, gridSettings } from './grid.helpers';

const GridColumn: React.FC<GridColumnProps> = ({
	span = 1,
	children,
	className,
}) => {
	// Se puede mejorar para aceptar breakpoints, por ahora usaremos 'mobile'
	const variant = 'mobile';
	const style = getColumnWidth(span, variant);

	return (
		<div className={className} style={{ ...style, boxSizing: 'border-box' }}>
			{children}
		</div>
	);
};

export default GridColumn;

