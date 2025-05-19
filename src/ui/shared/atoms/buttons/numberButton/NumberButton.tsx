import React from 'react';
import { StyledNumberButton } from './numberButton.styles';
import { NumberButtonProps } from './NumberButton.types';

const NumberButton: React.FC<NumberButtonProps> = ({
	value,
	selected = false,
	btnVariant = 'filled',
	...rest
}) => (
	<StyledNumberButton
		selected={selected}
		btnVariant={btnVariant}
		{...rest}
	>
		{value}
	</StyledNumberButton>
);

export default NumberButton;

