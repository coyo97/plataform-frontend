// shared/atoms/checks/check.styles.ts
import { styled } from '@mui/material/styles';
import { colors } from '../../../../Theme/tokens/colors';
import { radius } from '../../../../Theme/tokens/radius';
import { shadows } from '../../../../Theme/tokens/shadows';
import mq from '../../../../config/mq';

const SIZE = 20; // px

const variantMap = {
	default: colors.neutral.black[500],
	success: colors.feedback.positive[500],
	info   : colors.brand.tertiary[500],
	warning: colors.feedback.warning[500],
	danger : colors.feedback.negative[500],
} as const;

export const Wrapper = styled('label')({
	display    : 'inline-flex',
	alignItems : 'center',
	cursor     : 'pointer',
	gap        : 8,
});

export const HiddenCheckbox = styled('input')({
	border    : 0,
	clip      : 'rect(0 0 0 0)',
	clippath  : 'inset(50%)',
	height    : 1,
	margin    : -1,
	overflow  : 'hidden',
	padding   : 0,
	position  : 'absolute',
	whiteSpace: 'nowrap',
	width     : 1,
});

export const StyledBox = styled('span')<{
	$checked : boolean;
	$variant : keyof typeof variantMap;
	$disabled: boolean | undefined;
}>(({ $checked, $variant, $disabled, theme }) => ({
	width        : SIZE,
	height       : SIZE,
	borderRadius : radius.sm,
	border       : `2px solid ${variantMap[$variant]}`,
	display      : 'flex',
	alignItems   : 'center',
	justifyContent: 'center',
	background   : $checked ? variantMap[$variant] : 'transparent',
	transition   : 'all .2s',
	boxShadow    : $checked ? shadows.sm : 'none',
	...( $disabled && {
		opacity: 0.5,
		cursor : 'not-allowed',
	}),
	// modo hover solo si no está marcado ni deshabilitado
	'&:hover': !$checked && !$disabled
		? { background: variantMap[$variant] + '20' }   // 12% opacity
		: {},
		// ejemplo responsive opcional
		[mq('xs','max')]: { width: 18, height: 18 },
}));

export const CheckMark = styled('svg')({
	width : 12,
	height: 12,
	fill  : colors.neutral.white[900],
});

