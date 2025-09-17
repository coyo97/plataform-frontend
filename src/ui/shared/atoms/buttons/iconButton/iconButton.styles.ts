import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import mq from '../../../../../config/mq';
import { IconButtonProps } from './IconButton.types';

type PaletteKey = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'accent';

const shouldForwardProp = (prop: PropertyKey) =>
	!['colorType', 'sizeType', 'shape'].includes(prop as string);

const sizeMap = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
};

const radiusMap = {
	square: 4,
	rounded: 8,
	circle: 999,
};

export const StyledIconButton = styled(IconButton, { shouldForwardProp })<{
	colorType?: PaletteKey;
	sizeType?: IconButtonProps['sizeType'];
	shape?: IconButtonProps['shape'];
}>(({ theme, colorType = 'primary', sizeType = 'md', shape = 'rounded' }) => {
	const palette = theme.palette[colorType] || theme.palette.primary;
	const size = sizeMap[sizeType];
	const radius = radiusMap[shape];

	return {
		width: size,
		height: size,
		borderRadius: radius,
		color: palette.contrastText,
		backgroundColor: palette.main,
		'&:hover': {
			backgroundColor: palette.dark,
		},
		'&:disabled': {
			opacity: 0.5,
			cursor: 'not-allowed',
		},
		[mq('sm', 'max')]: {
			width: size * 0.85,
			height: size * 0.85,
		},
	};
});

