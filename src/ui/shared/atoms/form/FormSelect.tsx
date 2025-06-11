// shared/atoms/form/FormSelect.tsx
import { MenuItem, SelectChangeEvent } from '@mui/material';
import React, { forwardRef } from 'react';
import { StyledFormSelect } from './formSelect.styles';
import { FormSelectProps } from './FormSelect.types';

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	(
		{
			colorType = 'primary',
			variantType = 'solid',
			label,
			options = [],
			onChange,
			value,
			...props
		},
		ref
	) => {
		const handleChange = (e: SelectChangeEvent<unknown>) => {
			const value = e.target.value as string;
			if (onChange) onChange(value, e as SelectChangeEvent<string>);
		};

		return (
			<StyledFormSelect
				inputRef={ref}
				colorType={colorType}
				variantType={variantType}
				value={value}
				onChange={handleChange}
				{...props}
			>
				{options.map(opt => (
					<MenuItem key={opt.value} value={opt.value}>
						{opt.label}
					</MenuItem>
				))}
			</StyledFormSelect>
		)
	}
)

FormSelect.displayName = 'FormSelect';
export default FormSelect;

