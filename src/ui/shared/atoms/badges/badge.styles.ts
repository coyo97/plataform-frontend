import { styled } from '@mui/material/styles';
import { PaletteColor } from '@mui/material/styles';
import mq from '../../../../config/mq';
import { radius } from '../../../../Theme/tokens/radius';

export const BadgeWrapper = styled('div', {
	shouldForwardProp: (prop) =>
		!['variant', 'color', 'shape', 'size'].includes(prop as string),
})<{
	variant: 'filled' | 'outline' | 'soft';
	color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
	shape: 'default' | 'rounded';
	size: 'sm' | 'md';
}>(({ theme, variant, color, shape, size }) => {
	const paletteColor: PaletteColor = (theme.palette as any)[color] || theme.palette.primary;
	const borderRadius = shape === 'rounded' ? radius.infinity : radius.sm2x;
	const padding = size === 'sm' ? '2px 6px' : '4px 10px';
	const fontSize = size === 'sm' ? '0.75rem' : '0.875rem';

	const styles: Record<string, React.CSSProperties> = {
		filled: {
			backgroundColor: paletteColor.main,
			color: paletteColor.contrastText,
			border: 'none',
		},
		outline: {
			backgroundColor: 'transparent',
			color: paletteColor.main,
			border: `1px solid ${paletteColor.main}`,
		},
		soft: {
			backgroundColor: paletteColor.light,
			color: paletteColor.main,
			border: 'none',
		},
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
		...styles[variant],
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

