// ui/components/atoms/form/FormTextField.tsx
import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const Styled = styled(TextField)({ 
	width: '100%', 
	maxHeight: '100%',
	boxSizing: 'border-box'
});

const FormTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => <Styled ref={ref} {...props} />
);

export default FormTextField;

