import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { NumberButtonProps } from './NumberButton.types';
import {radius} from '../../../../../Theme/tokens/radius';

const shouldForward = (prop: PropertyKey) =>
	!['btnVariant', 'selected', 'btnSize'].includes(prop as string);

type Extra = Pick<NumberButtonProps, 'btnVariant' | 'selected' | 'btnSize'>;

const sizeMap = {
	sm: 32,
	md: 36,
	lg: 44,
};

const RawStyled = styled(Button, { shouldForwardProp: shouldForward })<Extra>(
	({ theme, btnVariant = 'filled', selected = false, btnSize = 'md' }) => {
		const size = sizeMap[btnSize];

		const base = {
			minWidth: size,
			height: size,
			padding: '0 10px',
			fontWeight: 600,
			fontSize: 14,
			borderRadius: parseInt(radius.sm3x), // 6px desde tokens
			textTransform: 'none',
		};

		const variants = {
			filled: {
				backgroundColor: selected
					? theme.palette.primary.main
					: theme.palette.grey[200],
					color: selected
						? theme.palette.primary.contrastText
						: theme.palette.text.primary,
						'&:hover': {
							backgroundColor: selected
								? theme.palette.primary.dark
								: theme.palette.grey[300],
						},
			},
			outlined: {
				backgroundColor: 'transparent',
				border: `1px solid ${
					selected ? theme.palette.primary.main : theme.palette.grey[400]
				}`,
				color: selected
					? theme.palette.primary.main
					: theme.palette.text.primary,
					'&:hover': {
						backgroundColor: theme.palette.action.hover,
					},
			},
			ghost: {
				backgroundColor: 'transparent',
				color: selected
					? theme.palette.primary.main
					: theme.palette.text.secondary,
					'&:hover': {
						textDecoration: 'underline',
					},
			},
		} as const;

		return { ...base, ...(variants[btnVariant] as any) };
	}
);

export const StyledNumberButton =
	RawStyled as React.ComponentType<Extra & ButtonProps>;
