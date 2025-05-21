// countrySelector.styles.ts
import { styled } from '@mui/material/styles';
import { colors } from '../../../../Theme/tokens/colors';
import { radius } from '../../../../Theme/tokens/radius';
import { shadows } from '../../../../Theme/tokens/shadows';
import mq from '../../../../config/mq';

export const Wrapper = styled('div')({
	width: '100%',
	position: 'relative',
});

export const SelectBox = styled('div')<{
	$error: boolean;
	$disabled: boolean;
}>(({ $error, $disabled }) => ({
	width: '100%',
	padding: '8px 12px',
	borderRadius: radius.md,
	border: `1px solid ${
		$error
			? colors.feedback.negative[500]
			: colors.neutral.graySoft[300]
	}`,
	background: $disabled
		? colors.neutral.graySoft[50]
		: colors.neutral.white[900],
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		cursor: $disabled ? 'not-allowed' : 'pointer',
		boxShadow: shadows.xs,
		'&:focus': {
			outline: `2px solid ${colors.brand.primary[300]}`,
			borderColor: colors.brand.primary[500],
		},
}));

export const Dropdown = styled('ul')({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	position: 'absolute',
	top: '100%',
	left: 0,
	right: 0,
	maxHeight: 240,
	overflowY: 'auto',
	overflowX: 'hidden',//En la seleccion evita el scroll horizontal.
	borderRadius: radius.md,
	boxShadow: shadows.md,
	background: colors.neutral.white[900],
	zIndex: 10,
});

export const Option = styled('li')<{ $active: boolean }>(({ $active }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	padding: '8px 12px',
	cursor: 'pointer',
	background: $active ? colors.neutral.graySoft[50] : 'transparent',
	'&:hover': { background: colors.neutral.graySoft[50] },
}));

