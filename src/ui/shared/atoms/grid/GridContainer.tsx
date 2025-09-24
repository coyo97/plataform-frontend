import React from 'react';
import { GridContainerProps } from './grid.types';
import { gridSettings } from './grid.helpers';

const GridContainer: React.FC<GridContainerProps> = ({
	variant = 'mobile',
	 columns,
	children,
	className,
	style,
}) => {
	const settings = gridSettings[variant];

	return (
		<div
			className={className}
			style={{
    maxWidth: `${settings.containerWidth}px`,
    margin: `0 auto`,
    paddingLeft: settings.marginX,
    paddingRight: settings.marginX,
    display: 'grid',
    gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))`, // ✅
    gap: `${settings.gutter}px`,
    boxSizing: 'border-box',
    ...style,
			}}
		>
			{children}
		</div>
	);
};

export default GridContainer;

