import React from 'react';
import { GridColumnProps } from './grid.types';
import { getColumnWidth, gridSettings, getColumnSpan } from './grid.helpers';

const GridColumn: React.FC<GridColumnProps> = ({
	span = 1,
	children,
	className,
	as = 'div',
}) => {
	// Se puede mejorar para aceptar breakpoints, por ahora usaremos 'mobile'
	const variant = 'mobile';
	//const style = getColumnWidth(span, variant);
	const style = getColumnSpan(span);

	return React.createElement(
				as,
		{ className, style: { ...style, boxSizing: 'border-box' } },
		children
	);
};

export default GridColumn;

