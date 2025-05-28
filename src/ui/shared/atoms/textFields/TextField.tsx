import React from 'react';
import { TextFieldProps } from './textField.types';
import { StyledTextFieldWrapper, StyledInput, Label, HelperText, IconWrapper } from './textField.styles';

const TextField: React.FC<TextFieldProps> = ({
	label,
	value,
	onChange,
	placeholder,
	error = false,
	helperText,
	disabled = false,
	leftIcon,
	rightIcon,
	size = 'medium',
	className,
	type = 'text',
	multiline = false,   //  valor por defecto
	rows       = 3,      // 
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return (
		<StyledTextFieldWrapper className={className} size={size} error={error} disabled={disabled}>
			{label && <Label htmlFor={label}>{label}</Label>}

			<div style={{ position: 'relative', width: '100%' }}>
				{leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}

				<StyledInput
					id={label}
					type={type}
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					error={error}
					disabled={disabled}
					hasLeftIcon={!!leftIcon}
					hasRightIcon={!!rightIcon}
					aria-invalid={error}
					aria-label={label}
					as={multiline ? 'textarea' : 'input'}       
					{...(multiline && { rows })}
				/>

				{rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
			</div>

			{helperText && <HelperText error={error}>{helperText}</HelperText>}
		</StyledTextFieldWrapper>
	);
};

export default TextField;

