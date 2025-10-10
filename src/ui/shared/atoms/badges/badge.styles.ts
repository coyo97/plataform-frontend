// src/ui/shared/atoms/badges/badge.styles.ts
import { styled } from '@mui/material/styles';
import { PaletteColor } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';

export const BadgeWrapper = styled('div', {
	shouldForwardProp: (prop) =>
		!['variant', 'color', 'shape', 'size', '$interactive'].includes(prop as string),
})<{
	variant: 'filled' | 'outline' | 'soft';
	color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
	shape: 'default' | 'rounded';
	size: 'sm' | 'md';
	$interactive?: boolean;
}>(({ theme, variant, color, shape, size, $interactive }) => {
	const paletteColor: PaletteColor = (theme.palette as any)[color] || theme.palette.primary;
	const borderRadius = shape === 'rounded' ? radius.infinity : radius.sm2x;
	const padding = size === 'sm' ? '2px 8px' : '4px 10px'; // un pelín más “chip”
	const fontSize = size === 'sm' ? '0.75rem' : '0.875rem';

	const styles: Record<string, React.CSSProperties> = {
		filled: { backgroundColor: paletteColor.main, color: paletteColor.contrastText, border: 'none' },
		outline:{ backgroundColor: 'transparent', color: paletteColor.main, border: `1px solid ${paletteColor.main}` },
		soft:   { backgroundColor: (paletteColor as any).light || theme.palette.action.hover, color: paletteColor.main, border: 'none' },
	};

return {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding,
  fontSize,
  fontWeight: 500,
  borderRadius,
  whiteSpace: 'nowrap',
  transition: 'background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease, color 120ms ease',
  ...styles[variant],

  // ✅ reset cuando es <button>
  '&[type="button"]': {
    border: 'none',
    background: 'inherit',
    font: 'inherit',
    letterSpacing: 'inherit',
  },

  ...( $interactive ? {
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    '&:hover': {
      backgroundColor:
        variant === 'outline'
          ? `${paletteColor.main}14`
          : variant === 'soft'
          ? `${(paletteColor as any).light || theme.palette.action.hover}`
          : undefined,
      boxShadow: theme.shadows[1],
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: 'none',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${paletteColor.main}33`,
    },
  } : null),
};
});

export const Icon = styled('span')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const Image = styled('img')({
	width: 20,
	height: 20,
	borderRadius: '50%',
	objectFit: 'cover',
});

export const Label = styled('span')({});

