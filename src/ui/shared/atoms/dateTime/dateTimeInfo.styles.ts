import { styled } from '@mui/material/styles';

export const Wrapper = styled('span')<{ variant: string; size: string }>(({ theme, variant, size }) => ({
	display: 'inline-flex',
	alignItems: 'center',
	gap: theme.spacing(0.5),
	fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
	opacity: variant === 'compact' ? 0.7 : 1,
}));

export const IconWrapper = styled('span')(() => ({
	display: 'inline-flex',
	alignItems: 'center',
	lineHeight: 0,
}));

