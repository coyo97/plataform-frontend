import React from 'react';
import { styled } from '@mui/material/styles';
import { GridContainerProps, BreakpointLabel, GridVariant } from './grid.types';
import { gridSettings } from './grid.helpers';
import mq, {breakPoints} from '../../../../config/mq';

type Props = {
	$variant: GridVariant;
	$columns?: Partial<Record<BreakpointLabel, number>>;
};

const Root = styled('div', {
	shouldForwardProp: (prop) => prop !== '$variant' && prop !== '$columns',
})<Props>(({ $variant, $columns }) => {
	const settings = gridSettings[$variant];
	const maxW =
		typeof settings.containerWidth === 'number'
			? `${settings.containerWidth}px`
			: settings.containerWidth;

			  //  toma la menor definición de columns como BASE
  const pickBaseCols = () => {
    if (!$columns) return settings.columns;
    const order: BreakpointLabel[] = ['xxs','xs','sm','md','lg','xl'] as any;
    for (const bp of order) {
      const v = ($columns as any)[bp];
      if (v) return v;
    }
    return settings.columns;
  };
  const baseCols = pickBaseCols();

			const base: Record<string, any> = {
				width: '100%',
				maxWidth: maxW,
				margin: '0 auto',
				paddingLeft: settings.marginX,
				paddingRight: settings.marginX,
				display: 'grid',
				gridTemplateColumns: `repeat(${baseCols}, minmax(0, 1fr))`,
				gap: `${settings.gutter}px`,
				boxSizing: 'border-box',
			};

			// columns responsivos -> media queries reales
			if ($columns) {
				(Object.keys($columns) as (keyof typeof breakPoints.values)[]).forEach(
					(bp) => {
						const value = $columns[bp];
						if (value) {
							base[mq(bp, 'min')] = {
								...(base[mq(bp, 'min')] || {}),
								gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
							};
						}
					}
				);
			}

			return base;
});

const GridContainer: React.FC<GridContainerProps> = ({
	variant = 'mobile',
	columns,
	children,
	className,
	style,
}) => {
	return (
		<Root className={className} style={style} $variant={variant} $columns={columns}>
			{children}
		</Root>
	);
};

export default GridContainer;

