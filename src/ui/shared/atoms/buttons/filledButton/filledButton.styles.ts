import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { FilledButtonProps } from './FilledButton.type';

type PaletteKey = keyof typeof import('../../../../../Theme/Theme').theme.palette.button;

const shouldForwardProp = (prop: PropertyKey) =>
  !['colorType', 'btnVariant', 'shape'].includes(prop as string);

const RawStyled = styled(Button, { shouldForwardProp })<{
  colorType?: PaletteKey;
  btnVariant?: FilledButtonProps['btnVariant'];
  shape?: FilledButtonProps['shape'];
}>(({ theme, colorType = 'primary', btnVariant = 'default', shape = 'rounded' }) => {
  const buttonPalette =
    theme.palette.button?.[colorType] ?? theme.palette.button.primary;

  const borderRadius =
    shape === 'square' ? 4 : shape === 'circle' ? 999 : 8;

  const base = {
    textTransform: 'none',
    fontWeight: 500,
    borderRadius,
    padding: theme.spacing(1, 2),
    gap: theme.spacing(1),
    minWidth: 0,
  };

  const variants = {
    default: {
      backgroundColor: buttonPalette.background,
      color: buttonPalette.text,
      '&:hover': { backgroundColor: buttonPalette.hover },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: buttonPalette.background,
      border: `1px solid ${buttonPalette.background}`,
      '&:hover': { backgroundColor: buttonPalette.hover },
    },
    light: {
      backgroundColor: buttonPalette.hover,
      color: buttonPalette.text,
      '&:hover': {
        backgroundColor: buttonPalette.background,
        color: buttonPalette.text,
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: buttonPalette.background,
      border: `1px solid ${buttonPalette.background}`,
      '&:hover': { backgroundColor: buttonPalette.hover },
    },
    soft: {
      backgroundColor: buttonPalette.hover,
      color: buttonPalette.background,
      '&:hover': { backgroundColor: buttonPalette.background },
    },
  } as const;

  return { ...base, ...(variants[btnVariant] as any) };
});

export const StyledFilledButton =
  RawStyled as React.ComponentType<FilledButtonProps & ButtonProps>;

