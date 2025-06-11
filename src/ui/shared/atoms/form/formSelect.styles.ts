// shared/atoms/form/formSelect.styles.ts
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import { FormSelectProps } from './FormSelect.types';

const shouldForwardProp = (prop: PropertyKey) =>
	!['colorType', 'variantType'].includes(prop as string);

export const StyledFormSelect = styled(Select, { shouldForwardProp })<{
	colorType?: FormSelectProps['colorType'];
	variantType?: FormSelectProps['variantType'];
}>(({ theme, colorType = 'primary', variantType = 'solid' }) => {
	const palette = theme.palette[colorType] || theme.palette.primary;

	const base = {
		width: '100%',
		borderRadius: 8,
		backgroundColor: 'transparent',
		border: 'none',
		'& .MuiSelect-select': {
			padding: theme.spacing(1, 2),
		},
	};

	const variants = {
		solid: {
			backgroundColor: palette.light,
			color: palette.dark,
		},
		outline: {
			border: `1px solid ${palette.main}`,
			color: palette.main,
		},
		underline: {
			borderBottom: `2px solid ${palette.main}`,
			borderRadius: 0,
			color: palette.main,
		},
	} as const;

	return {
		...base,
		...(variants[variantType] ?? {}),
	};
});

