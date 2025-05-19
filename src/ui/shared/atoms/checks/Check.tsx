import React from 'react';
import {
	CheckWrapper,
	BoxVisual,
	CheckMark,
	StyledLabel
} from './check.styles';
import { CheckProps } from './check.types';

const Check: React.FC<CheckProps> = ({
	checked,
	onChange,
	disabled = false,
	variant = 'default',
	children,
}) => {
	const handleToggle = () => {
		if (!disabled) onChange(!checked);
	};

	return (
		<CheckWrapper
			role="checkbox"
			aria-checked={checked}
			aria-disabled={disabled}
			onClick={handleToggle}
			disabled={disabled}
		>
			<BoxVisual checked={checked} disabled={disabled} variant={variant}>
				{checked && <CheckMark />}
			</BoxVisual>
			{children && <StyledLabel disabled={disabled}>{children}</StyledLabel>}
		</CheckWrapper>
	);
};

export default Check;

