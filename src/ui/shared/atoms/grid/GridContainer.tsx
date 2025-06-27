import React from 'react';
import { GridContainerProps } from './grid.types';
import { gridSettings } from './grid.helpers';

const GridContainer: React.FC<GridContainerProps> = ({
	variant = 'mobile',
	 columns,
	children,
	className,
}) => {
	const settings = gridSettings[variant];

	return (
		<div
			className={className}
			style={{
				maxWidth: settings.containerWidth,
				margin: `0 auto`,
				paddingLeft: settings.marginX,
				paddingRight: settings.marginX,
				display: 'flex',
				flexWrap: 'wrap',
				gap: `${settings.gutter}px`,
				boxSizing: 'border-box',
			}}
		>
			{children}
		</div>
	);
};

export default GridContainer;

