// FilledButton.tsx
import React from 'react';
import { StyledFilledButton } from './filledButton.styles';
import { FilledButtonProps } from './FilledButton.type';

const FilledButton: React.FC<FilledButtonProps> = ({
	children,
	colorType = 'primary',
	btnVariant= 'default',
	shape = 'rounded',
	...rest
}) => (
	<StyledFilledButton
		colorType={colorType}
		btnVariant={btnVariant}
		shape={shape}
		{...rest}
	>
		{children}
	</StyledFilledButton>
);

export default FilledButton;

