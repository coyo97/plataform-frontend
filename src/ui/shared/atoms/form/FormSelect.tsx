import React, { forwardRef } from 'react';
import { Select, SelectProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/** ——— 100 % width y mismo margen en todo el proyecto ——— */
const StyledSelect = styled(Select)({
  width: '100%',
});

const FormSelect = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => (
  <StyledSelect
    /**  
     *  `ref` se pasa a `inputRef` porque MUI lo expone así  
     *   (mantiene tipado y funciona con react-hook-form, etc.)  
     */
    inputRef={ref}
    {...props}
  />
));

FormSelect.displayName = 'FormSelect';
export default FormSelect;

