import { styled } from '@mui/material/styles';
import { colors } from '../../../../Theme/tokens/colors';
import { radius } from '../../../../Theme/tokens/radius';
import { padding } from '../../../../Theme/tokens/padding';
import typography from '../../../../Theme/tokens/typography';

export const StyledGroup = styled('div')<{ variant: string }>(({ variant }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: padding.px8,

	...(variant === 'segmented' && {
		flexDirection: 'row',
		flexWrap: 'wrap',
	}),
}));

export const StyledLabel = styled('span')({
	...typography.heading.h3.sans.regular,
	fontWeight: 600,
	color: colors.neutral.black[800],
	marginBottom: padding.px4,
});

export const StyledOption = styled('label')<{ disabled?: boolean; variant: string }>(({ disabled, variant }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: padding.px2,
	padding: padding.px2,
	border: `1px solid ${colors.neutral.graySoft[300]}`,
	borderRadius: radius.sm4x,
	cursor: disabled ? 'not-allowed' : 'pointer',
	backgroundColor: colors.neutral.white[900],
	transition: 'border-color 0.2s ease, background-color 0.2s ease',
	minHeight: 36,

	'&[data-checked=true]': {
		borderColor: colors.brand.primary[500], 
		backgroundColor: colors.brand.primary[25], 
	},

	...(variant === 'segmented' && {
		minWidth: 100,
		justifyContent: 'center',
		flex: 1,
	}),
}));

export const StyledInput = styled('input')({
	display: 'none',
});

export const StyledIcon = styled('span')({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    fontSize: '16px',         // ó 18 px si quieres un pelín más grande
  },
});


export const StyledText = styled('span')({
	...typography.heading.h3.sans.regular,
	color: colors.neutral.black[900],
});
