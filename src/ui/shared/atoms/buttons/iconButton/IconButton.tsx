// src/ui/shared/atoms/buttons/iconButton/IconButton.tsx
import React from 'react';
import { StyledIconButton } from './iconButton.styles';
import { IconButtonProps } from './IconButton.types';

const IconButton: React.FC<IconButtonProps> = ({
	children,
	ariaLabel,
	colorType = 'primary',
	sizeType = 'md',
	shape = 'rounded',
	...rest
}) => (
	<StyledIconButton
		colorType={colorType}
		sizeType={sizeType}
		shape={shape}
		aria-label={ariaLabel}
		{...rest}
	>
		{children}
	</StyledIconButton>
);

export default IconButton;

