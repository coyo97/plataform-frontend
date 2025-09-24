import React from 'react';
import { styled } from '@mui/material/styles';
import { GridColumnProps, BreakpointLabel } from './grid.types';
import mq,{breakPoints} from '../../../../config/mq';

type Props = {
	$span: number | Partial<Record<BreakpointLabel, number>>;
	as?: keyof JSX.IntrinsicElements;
};

const order: BreakpointLabel[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];

const Root = styled('div', {
	shouldForwardProp: (prop) => prop !== '$span',
})<Props>(({ $span }) => {
	const css: Record<string, any> = {
		boxSizing: 'border-box',
		minWidth: 0,
	};

	if (typeof $span === 'number') {
		css.gridColumn = `span ${$span}`;
		return css;
	}

	// Fallback base (el más pequeño definido)
	const fallback =
		$span.xxs ?? $span.xs ?? $span.sm ?? $span.md ?? $span.lg ?? $span.xl;
	if (fallback) css.gridColumn = `span ${fallback}`;

	// Media queries reales
	order.forEach((bp) => {
		const val = $span[bp];
		if (val) {
			css[mq(bp, 'min')] = { gridColumn: `span ${val}` };
		}
	});

	return css;
});

const GridColumn: React.FC<GridColumnProps> = ({
	span = 1,
	children,
	className,
	as = 'div',
	style,
}) => {
	return (
		<Root className={className} $span={span} as={as} style={style}>
			{children}
		</Root>
	);
};

export default GridColumn;

