import React from 'react';
import { TextFieldProps } from './textField.types';
import { StyledTextFieldWrapper, StyledInput, Label, HelperText, IconWrapper, Counter,EndAdornment } from './textField.styles';
import { useEffect, useRef } from 'react';

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
	autoResize,
	endAdornment,
	counter,
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (multiline && autoResize && inputRef.current) {
			const el = inputRef.current;
			el.style.height = 'auto';
			el.style.height = `${el.scrollHeight}px`;
		}
	}, [value, multiline, autoResize]);

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
					hasRightIcon={!!(rightIcon || endAdornment)}
					aria-invalid={error}
					aria-label={label}
					ref={inputRef as React.RefObject<any>}
					as={multiline ? 'textarea' : 'input'}
					{...(multiline && { rows })}
					style={
						autoResize
							? { overflow: 'hidden', resize: 'none', maxHeight: 'calc(1.5em * 5 + 1.5rem)' }
							: undefined
					}
				/>

				{rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
				{endAdornment && <EndAdornment>{endAdornment}</EndAdornment>}
			</div>

			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				{helperText && <HelperText error={error}>{helperText}</HelperText>}
				{counter && <Counter>{counter}</Counter>}
			</div>
		</StyledTextFieldWrapper>
	);
};

export default TextField;
