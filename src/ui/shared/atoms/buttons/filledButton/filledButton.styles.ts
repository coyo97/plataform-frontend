// filledButton.styles.ts
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { FilledButtonProps } from './FilledButton.type';

type PaletteKey = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

const shouldForwardProp = (prop: PropertyKey) =>
	!['colorType', 'btnVariant', 'shape'].includes(prop as string);

const RawStyled = styled(
	Button,
	{ shouldForwardProp },
)<{
	colorType?: PaletteKey;
	btnVariant?: FilledButtonProps['btnVariant'];
	shape?: FilledButtonProps['shape'];
}>(({ theme, colorType = 'primary', btnVariant = 'default', shape = 'rounded' }) => {
	const palette = theme.palette[colorType] || theme.palette.primary;
	const borderRadius = shape === 'square' ? 4 : shape === 'circle' ? 999 : 8;

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
			backgroundColor: palette.main,
			color: palette.contrastText,
			'&:hover': { backgroundColor: palette.dark },
		},
		ghost: {
			backgroundColor: 'transparent',
			color: palette.main,
			border: `1px solid ${palette.main}`,
			'&:hover': { backgroundColor: palette.light },
		},
		light: {
			backgroundColor: palette.light,
			color: palette.dark,
			'&:hover': {
				backgroundColor: palette.main,
				color: palette.contrastText,
			},
		},
		outline: {
			backgroundColor: 'transparent',
			color: palette.main,
			border: `1px solid ${palette.main}`,
			'&:hover': { backgroundColor: palette.light },
		},
		soft: {
			// tonos 100/200 no tipados
			backgroundColor: (palette as any)[100] ?? palette.light,
			color: palette.main,
			'&:hover': {
				backgroundColor: (palette as any)[200] ?? palette.main,
			},
		},
	} as const;

	// 👇 Cast a any para que TS no arme una unión imposible
	return { ...base, ...(variants[btnVariant] as any) };
});

// 👇 Exporta con los props personalizados visibles en JSX
export const StyledFilledButton =
	RawStyled as React.ComponentType<FilledButtonProps & ButtonProps>;

