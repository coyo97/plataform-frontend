// shared/atoms/buttons/filledButton/FilledButton.tsx
import React from 'react';
import { StyledFilledButton } from './filledButton.styles';
import { FilledButtonProps }  from './FilledButton.type';

const FilledButton = React.forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      children,
      colorType  = 'info',
      btnVariant = 'outline',
      shape      = 'rounded',
      ...rest
    }: FilledButtonProps<C>,
    ref: React.Ref<Element>,
  ) => (
    <StyledFilledButton
      ref={ref as any}
      colorType={colorType}
      btnVariant={btnVariant}
      shape={shape}
      {...rest}
    >
      {children}
    </StyledFilledButton>
));

FilledButton.displayName = 'FilledButton';
export default FilledButton;

