import React from 'react';
import {
	StyledGroup,
	StyledLabel,
	StyledOption,
	StyledInput,
	StyledIcon,
	StyledText,
} from './radioGroup.styles';

import type { RadioGroupProps } from './radioGroup.types';

const RadioGroup: React.FC<RadioGroupProps> = ({
	legend,
	options,
	value,
	onChange,
	disabled = false,
	variant = 'default',
}) => {
	return (
		<StyledGroup aria-label={legend} role="radiogroup" variant={variant}>
			{legend && <StyledLabel>{legend}</StyledLabel>}

			{options.map((option) => (
				<StyledOption
					key={option.value}
					role="radio"
					aria-checked={value === option.value}
					data-checked={value === option.value || undefined}
					disabled={disabled}
					onClick={() => !disabled && onChange(option.value)}
					variant={variant}
				>
					<StyledInput
						type="radio"
						checked={value === option.value}
						readOnly
						tabIndex={-1}
					/>
					{option.icon && <StyledIcon>{option.icon}</StyledIcon>}
					<StyledText>{option.label}</StyledText>
				</StyledOption>
			))}
		</StyledGroup>
	);
};

export default RadioGroup;

