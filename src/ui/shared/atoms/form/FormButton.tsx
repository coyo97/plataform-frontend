import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/**  Botón genérico para formularios  */
const StyledButton = styled(Button)(({ theme }) => ({
  paddingInline: theme.spacing(4),
  textTransform: 'none',
  borderRadius : theme.shape.borderRadius,
}));

const FormButton: React.FC<ButtonProps> = (props) => (
  <StyledButton {...props} />
);

export default FormButton;

