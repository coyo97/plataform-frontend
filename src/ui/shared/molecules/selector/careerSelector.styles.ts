// countrySelector.styles.ts
import { styled } from '@mui/material/styles';
import { colors } from '../../../../Theme/tokens/colors';
import { radius } from '../../../../Theme/tokens/radius';
import { shadows } from '../../../../Theme/tokens/shadows';
import mq from '../../../../config/mq';

export const Wrapper = styled('div')({
	width: '100%',
	position: 'relative',
	overflow: 'visible',    /* ⬅ evita que aparezca otro scroll padre */
	minWidth: 0,            /* ⬅ asegura que nunca fuerce ancho */
});

export const SelectBox = styled('div')<{
	$error: boolean;
	$disabled: boolean;
	$variant  : 'default' | 'transparent';
}>(({ $error, $disabled, $variant }) => ({
	width: '100%',
	padding: '8px 12px',
	borderRadius: radius.md,
	border: `1px solid ${
		$variant === 'transparent'
			? colors.uatf.yellow            /* #FFD700 dorado */
			: ($error
				? colors.feedback.negative[500]
				: colors.neutral.graySoft[300])
	}`,
	background : $variant === 'transparent'
		? 'transparent'
		: ($disabled ? colors.neutral.graySoft[50] : colors.neutral.white[900]),
		boxShadow  : $variant === 'transparent' ? 'none' : shadows.xs,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		cursor: $disabled ? 'not-allowed' : 'pointer',
		'&:focus': {
			outline: `2px solid ${colors.brand.primary[300]}`,
			borderColor: colors.brand.primary[500],
		},
		'&:hover': {
			backgroundColor: $variant === 'transparent'? 'rgba(255, 215, 0, 0.08)' : 'none', // agradable visualmente
		},
}));

export const Dropdown = styled('ul')<{
	$variant: 'default' | 'transparent';
	$dropdownMode: 'overlay' | 'inline';
}>(({$variant, $dropdownMode}) => ({
	listStyle: 'none',
	position   : $dropdownMode === 'overlay' ? 'absolute' : 'relative',
	top        :$dropdownMode === 'overlay' ? '100%'     : 'auto',
	left       : 0,
	right      : 0,
	margin: 0,
	padding: 0,
	maxHeight: 240,
	overflowY: 'auto',
	overflowX: 'hidden',//En la seleccion evita el scroll horizontal.
	borderRadius: radius.md,
	boxShadow  : 'shadows.md',//$variant === 'transparent' ? 'none' : shadows.md,
	background : colors.neutral.white[900],//$variant === 'transparent' ? 'transparent' : colors.neutral.white[900],
	zIndex: 10,
}));

export const Option = styled('li')<{ $active: boolean }>(({ $active }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	padding: '8px 12px',
	cursor: 'pointer',
	background: $active ? colors.neutral.graySoft[50] : 'transparent',
	'&:hover': { background: colors.neutral.graySoft[50] },
}));

