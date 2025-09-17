import { styled } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';

export const Wrapper = styled('div')({
	width: '100%',
	position: 'relative',
	overflow: 'visible',
	minWidth: 0,
});

export const SelectBox = styled('div')<{
	$error: boolean;
	$disabled: boolean;
	$variant: 'default' | 'transparent' | 'filled';
}>(({ theme, $error, $disabled, $variant }) => {
	const palette = theme.palette.selector[$variant];

	return {
		width: '100%',
		padding: '8px 12px',
		borderRadius: radius.md,
		border: `1px solid ${palette.border}`,
		background: palette.border,
		color: palette.text,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		cursor: $disabled ? 'not-allowed' : 'pointer',
		'&:focus': {
			outline: `2px solid ${palette.focus}`,
			borderColor: palette.focus,
		},
		'&:hover': {
			backgroundColor: palette.hover,
		},
	};
});

export const Dropdown = styled('ul')<{
	$variant: 'default' | 'transparent' | 'filled';
	$dropdownMode: 'overlay' | 'inline';
}>(({ theme, $variant, $dropdownMode }) => {
	const palette = theme.palette.selector[$variant];

	return {
		listStyle: 'none',
		position: $dropdownMode === 'overlay' ? 'absolute' : 'relative',
		top: $dropdownMode === 'overlay' ? '100%' : 'auto',
		left: 0,
		right: 0,
		margin: 0,
		padding: 0,
		maxHeight: 240,
		overflowY: 'auto',
		overflowX: 'hidden',
		borderRadius: radius.md,
		boxShadow: theme.shadows[2],
		background: palette.background,
		zIndex: 10,
	};
});

export const Option = styled('li')<{ $active: boolean }>(({ theme, $active }) => {
	const palette = theme.palette.selector.filled;
	return {
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		padding: '8px 12px',
		cursor: 'pointer',
		background: $active ? palette.hover : 'transparent',
		'&:hover': { background: palette.hover },
	};
});

