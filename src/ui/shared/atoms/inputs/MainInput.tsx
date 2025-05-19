import React from 'react';
import {
	StyledWrapper,
	StyledLabel,
	StyledInputContainer,
	StyledInput,
	StyledHint,
	StyledError,
	IconContainer
} from './mainInput.styles';

import { MainInputProps } from './mainInput.types';

const MainInput: React.FC<MainInputProps> = ({
	label,
	placeholder,
	value,
	onChange,
	leftIcon,
	rightIcon,
	hint,
	error,
	disabled = false,
	type = 'text',
	multiline = false,
	rows = 3,
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	return (
		<StyledWrapper disabled={disabled}>
			{label && <StyledLabel>{label}</StyledLabel>}

			<StyledInputContainer error={!!error} disabled={disabled}>
				{leftIcon && <IconContainer position="left">{leftIcon}</IconContainer>}

				{multiline ? (
					<StyledInput
						as="textarea" // cambia el tipo de nodo a <textarea>
						{...(rows && { rows })}
						placeholder={placeholder}
						value={value}
						onChange={handleChange}
						disabled={disabled}
						aria-invalid={!!error}
						hasLeftIcon={!!leftIcon}
						hasRightIcon={!!rightIcon}
					/>
				) : (
					<StyledInput
						type={type}
						placeholder={placeholder}
						value={value}
						onChange={handleChange}
						disabled={disabled}
						aria-invalid={!!error}
						hasLeftIcon={!!leftIcon}
						hasRightIcon={!!rightIcon}
					/>
				)}

				{rightIcon && <IconContainer position="right">{rightIcon}</IconContainer>}
			</StyledInputContainer>

			{error ? <StyledError>{error}</StyledError> : hint && <StyledHint>{hint}</StyledHint>}
		</StyledWrapper>
	);
};

export default MainInput;

